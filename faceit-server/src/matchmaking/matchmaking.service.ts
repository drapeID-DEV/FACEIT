import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OnEvent } from '@nestjs/event-emitter'
import { randomUUID } from 'crypto'

import { parseTeamSize } from '@/libs/common/utils/team-size.util'
import { MatchService } from '@/match/match.service'
import { PartyChangedPayload, PartyService } from '@/party/party.service'

import { MatchType } from '../../generated/prisma'
import { buildTeams } from './build-teams'
import { QueueEntry, QueuePlayer } from './interfaces/queue-player.interface'
import {
	MatchAcceptance,
	MatchAcceptanceService
} from './match-acceptance.service'
import { MatchmakingGateway } from './matchmaking.gateway'

const ONE_VS_ONE_ELO_RANGE = 100
// Wider than 1v1, a full lobby within 100 ELO would rarely queue at the same time
const TEAM_ELO_RANGE = 300

@Injectable()
export class MatchmakingService implements OnModuleInit {
	constructor(
		private readonly matchService: MatchService,
		private readonly matchmakingGateway: MatchmakingGateway,
		private readonly matchAcceptanceService: MatchAcceptanceService,
		private readonly partyService: PartyService,
		private readonly configService: ConfigService
	) {}

	onModuleInit() {
		this.matchAcceptanceService.onExpired(acceptance =>
			this.cancelAcceptance(acceptance)
		)

		this.partyService.setMatchmakingStateResolver(userId => {
			if (this.matchAcceptanceService.findByUserId(userId)) {
				return 'ACCEPTANCE'
			}

			return this.findEntryByUserId(userId) ? 'QUEUE' : null
		})
	}

	private readonly queue: QueueEntry[] = []

	public getConfig() {
		return {
			teamSize: parseTeamSize(this.configService.get('TEAM_MATCH_SIZE'))
		}
	}

	public async joinQueue(
		players: QueuePlayer[],
		matchType: MatchType,
		partyId: string | null
	) {
		for (const player of players) {
			const activeMatch = await this.matchService.findActiveMatchByUserId(
				player.userId
			)

			if (activeMatch) {
				return {
					message:
						players.length > 1
							? 'A party member already has an active match.'
							: 'You already have an active match.',
					matchId: activeMatch.id
				}
			}
		}

		const isBusy = players.some(
			player =>
				this.findEntryByUserId(player.userId) ||
				this.matchAcceptanceService.findByUserId(player.userId)
		)

		if (isBusy) {
			return {
				message: 'Player is already in queue.'
			}
		}

		if (partyId) {
			this.partyService.clearInvites(partyId)
		}

		const entry: QueueEntry = {
			id: randomUUID(),
			partyId,
			matchType,
			players,
			joinedAt: new Date()
		}

		this.queue.push(entry)

		this.matchmakingGateway.notifyQueueUpdated(
			players.map(player => player.userId)
		)

		this.findMatch(entry)

		return {
			message: 'Searching for opponent...'
		}
	}

	public leaveQueue(userId: string) {
		const entry = this.findEntryByUserId(userId)

		if (!entry) {
			throw new NotFoundException('No such user in the queue')
		}

		this.removeEntry(entry)

		this.matchmakingGateway.notifyQueueUpdated(
			entry.players.map(player => player.userId)
		)

		return { message: 'You left the queue' }
	}

	private findEntryByUserId(userId: string) {
		return this.queue.find(entry =>
			entry.players.some(player => player.userId === userId)
		)
	}

	private removeEntry(entry: QueueEntry) {
		const index = this.queue.indexOf(entry)

		if (index !== -1) {
			this.queue.splice(index, 1)
		}
	}

	private findMatch(entry: QueueEntry) {
		const teams =
			entry.matchType === MatchType.TEAM
				? buildTeams(
						this.queue.filter(
							queued => queued.matchType === MatchType.TEAM
						),
						entry,
						this.getConfig().teamSize,
						TEAM_ELO_RANGE
					)
				: this.findOpponent(entry)

		if (!teams) {
			return null
		}

		for (const queued of teams.flat()) {
			this.removeEntry(queued)
		}

		const acceptance = this.matchAcceptanceService.create(
			entry.matchType,
			teams
		)

		this.matchmakingGateway.notifyMatchReady(acceptance)

		return acceptance
	}

	private findOpponent(
		entry: QueueEntry
	): [QueueEntry[], QueueEntry[]] | null {
		const opponent = this.queue.find(queued => {
			if (queued === entry || queued.matchType !== MatchType.ONE_VS_ONE) {
				return false
			}

			return (
				Math.abs(queued.players[0].elo - entry.players[0].elo) <=
				ONE_VS_ONE_ELO_RANGE
			)
		})

		return opponent ? [[entry], [opponent]] : null
	}

	// Groups that fully accepted go back in the queue, the rest drop out as one
	private cancelAcceptance(
		acceptance: MatchAcceptance,
		bannedUserId?: string
	) {
		const requeued: QueueEntry[] = []

		for (const entry of acceptance.teams.flat()) {
			const shouldRequeue = entry.players.every(
				player =>
					player.userId !== bannedUserId &&
					acceptance.acceptedPlayers.has(player.userId)
			)

			if (shouldRequeue) {
				requeued.push(entry)
			}

			for (const player of entry.players) {
				this.matchmakingGateway.notifyMatchCancelled(
					player.userId,
					shouldRequeue
				)
			}
		}

		for (const entry of requeued) {
			this.queue.push(entry)
			this.findMatch(entry)
		}
	}

	// A party that changes while queued is no longer the group that queued
	@OnEvent('party.changed')
	public handlePartyChanged({ partyId }: PartyChangedPayload) {
		const entry = this.queue.find(queued => queued.partyId === partyId)

		if (!entry) {
			return
		}

		this.removeEntry(entry)

		this.matchmakingGateway.notifyQueueUpdated(
			entry.players.map(player => player.userId)
		)
	}

	@OnEvent('user.banned')
	public handleUserBanned({ userId }: { userId: string }) {
		const entry = this.findEntryByUserId(userId)

		if (entry) {
			this.removeEntry(entry)

			for (const player of entry.players) {
				this.matchmakingGateway.notifyMatchCancelled(
					player.userId,
					false
				)
			}
		}

		const acceptance = this.matchAcceptanceService.findByUserId(userId)

		if (!acceptance) {
			return
		}

		this.matchAcceptanceService.remove(acceptance.id)

		this.cancelAcceptance(acceptance, userId)
	}

	public getQueueStatus(userId: string) {
		const entry = this.findEntryByUserId(userId)

		const countPlayers = (matchType: MatchType) =>
			this.queue
				.filter(queued => queued.matchType === matchType)
				.reduce((sum, queued) => sum + queued.players.length, 0)

		const searching = {
			ONE_VS_ONE: countPlayers(MatchType.ONE_VS_ONE),
			TEAM: countPlayers(MatchType.TEAM)
		}

		return {
			inQueue: !!entry,
			queuePosition: entry ? this.queue.indexOf(entry) + 1 : null,
			queueSize: searching.ONE_VS_ONE + searching.TEAM,
			searching,
			matchType: entry?.matchType || null,
			joinedAt: entry?.joinedAt || null
		}
	}
}
