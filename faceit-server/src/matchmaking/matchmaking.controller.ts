import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	Post,
	Req,
	Session
} from '@nestjs/common'
import { Request } from 'express'
import { SessionData } from 'express-session'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { PartyService } from '@/party/party.service'
import { UserService } from '@/user/user.service'

import { MatchType } from '../../generated/prisma'
import { JoinQueueDto } from './dto/join-queue.dto'
import { MatchAcceptanceService } from './match-acceptance.service'
import { MatchmakingService } from './matchmaking.service'

@Controller('matchmaking')
export class MatchmakingController {
	constructor(
		private readonly matchmakingService: MatchmakingService,
		private readonly userService: UserService,
		private readonly matchAcceptanceService: MatchAcceptanceService,
		private readonly partyService: PartyService
	) {}

	@Authorization()
	@Post('queue/join')
	async joinQueue(@Req() req: Request, @Body() dto: JoinQueueDto) {
		const userId = req.session.userId
		const party = this.partyService.findByUserId(userId)

		if (party && party.leaderId !== userId) {
			throw new ForbiddenException(
				'Only the party leader can start the queue.'
			)
		}

		const memberIds = party?.memberIds ?? [userId]

		if (memberIds.length > 1 && dto.matchType === MatchType.ONE_VS_ONE) {
			throw new BadRequestException(
				'A party cannot play 1v1, leave the party or switch to the team mode.'
			)
		}

		const members = await Promise.all(
			memberIds.map(id => this.userService.findById(id))
		)

		for (const member of members) {
			const isSelf = member.id === userId

			if (member.isBanned) {
				throw new ForbiddenException(
					isSelf
						? 'Your account is banned from matchmaking.'
						: `${member.nickname} is banned from matchmaking.`
				)
			}

			// Live CS2 stats are matched by SteamID, so unlinked players cannot play
			if (!member.steamId) {
				throw new ForbiddenException(
					isSelf
						? 'Link your Steam account in account settings to play.'
						: `${member.nickname} has not linked a Steam account.`
				)
			}
		}

		return this.matchmakingService.joinQueue(
			members.map(member => ({ userId: member.id, elo: member.elo })),
			dto.matchType,
			party?.id ?? null
		)
	}

	@Authorization()
	@Get('config')
	getConfig() {
		return this.matchmakingService.getConfig()
	}

	@Authorization()
	@Post('queue/leave')
	async leaveQueue(@Req() req: Request) {
		return this.matchmakingService.leaveQueue(req.session.userId)
	}

	@Authorization()
	@Get('queue/status')
	async getQueueStatus(@Req() req: Request) {
		return this.matchmakingService.getQueueStatus(req.session.userId)
	}

	@Get('acceptance')
	public getCurrentAcceptance(@Session() session: SessionData) {
		const acceptance = this.matchAcceptanceService.findByUserId(
			session.userId
		)

		if (!acceptance) {
			return {
				hasAcceptance: false
			}
		}

		return {
			hasAcceptance: true,
			acceptance: {
				acceptanceId: acceptance.id,
				expiresAt: acceptance.expiresAt,
				acceptedPlayers: acceptance.acceptedPlayers.size,
				totalPlayers: acceptance.players.length,
				hasAccepted: acceptance.acceptedPlayers.has(session.userId)
			}
		}
	}
}
