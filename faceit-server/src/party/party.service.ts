import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { randomUUID } from 'crypto'

import { FriendshipStatusResponse } from '@/friendship/frienship-status/frienship-status'
import { FriendshipService } from '@/friendship/friendship.service'
import { parseTeamSize } from '@/libs/common/utils/team-size.util'
import { MatchService } from '@/match/match.service'
import { PrismaService } from '@/prisma/prisma.service'

const INVITE_LIFETIME = 60_000

const userSelect = {
	id: true,
	nickname: true,
	profilePic: true,
	elo: true
}

interface PartyInvite {
	inviterId: string
	expiresAt: Date
	timeout: NodeJS.Timeout
}

export interface Party {
	id: string
	leaderId: string
	memberIds: string[]
	// keyed by the invited user's id
	invites: Map<string, PartyInvite>
}

export type MatchmakingState = 'QUEUE' | 'ACCEPTANCE' | null

export interface PartyChangedPayload {
	partyId: string
}

@Injectable()
export class PartyService {
	private readonly parties = new Map<string, Party>()

	// Set by MatchmakingService, the queue depends on parties and not the other way around
	private matchmakingStateResolver: (userId: string) => MatchmakingState =
		() => null

	constructor(
		private readonly prismaService: PrismaService,
		private readonly friendshipService: FriendshipService,
		private readonly matchService: MatchService,
		private readonly eventEmitter: EventEmitter2,
		private readonly configService: ConfigService
	) {}

	public setMatchmakingStateResolver(
		resolver: (userId: string) => MatchmakingState
	) {
		this.matchmakingStateResolver = resolver
	}

	private get maxSize() {
		return parseTeamSize(this.configService.get('TEAM_MATCH_SIZE'))
	}

	public findByUserId(userId: string) {
		return [...this.parties.values()].find(party =>
			party.memberIds.includes(userId)
		)
	}

	public async getState(userId: string) {
		const party = this.findByUserId(userId)

		const invites = [...this.parties.values()].flatMap(candidate => {
			const invite = candidate.invites.get(userId)

			return invite ? [{ partyId: candidate.id, ...invite }] : []
		})

		const userIds = [
			...(party?.memberIds ?? []),
			...(party?.invites.keys() ?? []),
			...invites.map(invite => invite.inviterId)
		]

		const users = await this.prismaService.user.findMany({
			where: { id: { in: userIds } },
			select: userSelect
		})

		const usersById = new Map(users.map(user => [user.id, user]))

		return {
			party: party
				? {
						id: party.id,
						leaderId: party.leaderId,
						maxSize: this.maxSize,
						members: party.memberIds.flatMap(
							id => usersById.get(id) ?? []
						),
						pendingInvites: [...party.invites.keys()].flatMap(
							id => usersById.get(id) ?? []
						)
					}
				: null,
			invites: invites.flatMap(invite => {
				const inviter = usersById.get(invite.inviterId)

				return inviter
					? [
							{
								partyId: invite.partyId,
								expiresAt: invite.expiresAt,
								inviter
							}
						]
					: []
			})
		}
	}

	public async invite(userId: string, targetUserId: string) {
		if (userId === targetUserId) {
			throw new BadRequestException('You cannot invite yourself.')
		}

		await this.assertFriends(userId, targetUserId)

		const currentParty = this.findByUserId(userId)

		if (currentParty && currentParty.leaderId !== userId) {
			throw new ForbiddenException('Only the party leader can invite.')
		}

		if (this.matchmakingStateResolver(userId)) {
			throw new ConflictException('Leave the queue before inviting.')
		}

		if (this.matchmakingStateResolver(targetUserId)) {
			throw new ConflictException('This player is in the queue.')
		}

		if (await this.matchService.findActiveMatchByUserId(userId)) {
			throw new ConflictException('You are in a match.')
		}

		if (await this.matchService.findActiveMatchByUserId(targetUserId)) {
			throw new ConflictException('This player is in a match.')
		}

		if (currentParty?.memberIds.includes(targetUserId)) {
			throw new ConflictException('This player is already in your party.')
		}

		if (currentParty?.invites.has(targetUserId)) {
			throw new ConflictException('This player is already invited.')
		}

		const taken = currentParty
			? currentParty.memberIds.length + currentParty.invites.size
			: 1

		if (taken >= this.maxSize) {
			throw new ConflictException('Your party is full.')
		}

		const party = currentParty ?? this.createParty(userId)

		party.invites.set(targetUserId, {
			inviterId: userId,
			expiresAt: new Date(Date.now() + INVITE_LIFETIME),
			timeout: setTimeout(
				() => this.removeInvite(party.id, targetUserId),
				INVITE_LIFETIME
			)
		})

		this.notify(party.memberIds)
		this.eventEmitter.emit('party.invited', { userId: targetUserId })

		return { message: 'Invite sent.' }
	}

	public async acceptInvite(userId: string, partyId: string) {
		const party = this.parties.get(partyId)
		const invite = party?.invites.get(userId)

		if (!party || !invite) {
			throw new NotFoundException('This invite is no longer valid.')
		}

		await this.assertFriends(userId, invite.inviterId)

		if (
			this.matchmakingStateResolver(userId) ||
			this.matchmakingStateResolver(party.leaderId)
		) {
			throw new ConflictException('Leave the queue before joining a party.')
		}

		if (
			(await this.matchService.findActiveMatchByUserId(userId)) ||
			(await this.matchService.findActiveMatchByUserId(party.leaderId))
		) {
			throw new ConflictException('You cannot join a party during a match.')
		}

		if (party.memberIds.length >= this.maxSize) {
			throw new ConflictException('This party is full.')
		}

		const previousParty = this.findByUserId(userId)

		if (previousParty) {
			this.removeMember(previousParty, userId)
		}

		clearTimeout(invite.timeout)
		party.invites.delete(userId)
		party.memberIds.push(userId)

		this.changed(party, [userId])

		return { message: 'You joined the party.' }
	}

	public declineInvite(userId: string, partyId: string) {
		const party = this.parties.get(partyId)

		if (!party?.invites.has(userId)) {
			throw new NotFoundException('This invite is no longer valid.')
		}

		this.removeInvite(partyId, userId)

		return { message: 'Invite declined.' }
	}

	public leave(userId: string) {
		const party = this.findByUserId(userId)

		if (!party) {
			throw new NotFoundException('You are not in a party.')
		}

		this.assertNotInAcceptance(userId)
		this.removeMember(party, userId)

		return { message: 'You left the party.' }
	}

	public kick(userId: string, targetUserId: string) {
		const party = this.findByUserId(userId)

		if (!party) {
			throw new NotFoundException('You are not in a party.')
		}

		if (party.leaderId !== userId) {
			throw new ForbiddenException('Only the party leader can kick.')
		}

		if (targetUserId === userId) {
			throw new BadRequestException('You cannot kick yourself.')
		}

		if (!party.memberIds.includes(targetUserId)) {
			throw new NotFoundException('This player is not in your party.')
		}

		this.assertNotInAcceptance(userId)
		this.removeMember(party, targetUserId)

		return { message: 'Player kicked.' }
	}

	// Pending invites would let the party change shape while it is queued
	public clearInvites(partyId: string) {
		const party = this.parties.get(partyId)

		if (!party) {
			return
		}

		const invited = [...party.invites.keys()]

		for (const invite of party.invites.values()) {
			clearTimeout(invite.timeout)
		}

		party.invites.clear()

		this.changed(party, invited)
	}

	@OnEvent('user.banned')
	public handleUserBanned({ userId }: { userId: string }) {
		const party = this.findByUserId(userId)

		if (party) {
			this.removeMember(party, userId)
		}
	}

	private async assertFriends(userId: string, targetUserId: string) {
		const { status } = await this.friendshipService.getFriendshipStatus(
			userId,
			targetUserId
		)

		if (status !== FriendshipStatusResponse.FRIENDS) {
			throw new ForbiddenException('You can only party with friends.')
		}
	}

	private assertNotInAcceptance(userId: string) {
		if (this.matchmakingStateResolver(userId) === 'ACCEPTANCE') {
			throw new ConflictException(
				'Finish the match acceptance before changing the party.'
			)
		}
	}

	private createParty(leaderId: string) {
		const party: Party = {
			id: randomUUID(),
			leaderId,
			memberIds: [leaderId],
			invites: new Map()
		}

		this.parties.set(party.id, party)

		return party
	}

	private removeInvite(partyId: string, userId: string) {
		const party = this.parties.get(partyId)
		const invite = party?.invites.get(userId)

		if (!party || !invite) {
			return
		}

		clearTimeout(invite.timeout)
		party.invites.delete(userId)

		this.changed(party, [userId])
	}

	private removeMember(party: Party, userId: string) {
		party.memberIds = party.memberIds.filter(id => id !== userId)

		if (party.leaderId === userId && party.memberIds.length > 0) {
			party.leaderId = party.memberIds[0]
		}

		this.changed(party, [userId])
	}

	// A party of one only lives on while it still waits for someone to answer
	private changed(party: Party, removedUserIds: string[]) {
		const affected = [...removedUserIds]

		if (
			party.memberIds.length === 0 ||
			(party.memberIds.length === 1 && party.invites.size === 0)
		) {
			for (const [userId, invite] of party.invites) {
				clearTimeout(invite.timeout)
				affected.push(userId)
			}

			party.invites.clear()
			this.parties.delete(party.id)
		}

		this.eventEmitter.emit('party.changed', {
			partyId: party.id
		} satisfies PartyChangedPayload)

		this.notify([...party.memberIds, ...affected])
	}

	private notify(userIds: string[]) {
		this.eventEmitter.emit('party.updated', { userIds })
	}
}
