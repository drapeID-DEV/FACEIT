import {
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
import { UserService } from '@/user/user.service'

import { JoinQueueDto } from './dto/join-queue.dto'
import { MatchAcceptanceService } from './match-acceptance.service'
import { MatchmakingService } from './matchmaking.service'

@Controller('matchmaking')
export class MatchmakingController {
	constructor(
		private readonly matchmakingService: MatchmakingService,
		private readonly userService: UserService,
		private readonly matchAcceptanceService: MatchAcceptanceService
	) {}

	@Authorization()
	@Post('queue/join')
	async joinQueue(@Req() req: Request, @Body() dto: JoinQueueDto) {
		const user = await this.userService.findById(req.session.userId)

		// Live CS2 stats are matched by SteamID, so unlinked players cannot play
		if (!user.steamId) {
			throw new ForbiddenException(
				'Link your Steam account in account settings to play.'
			)
		}

		return this.matchmakingService.joinQueue({
			userId: user.id,
			elo: user.elo,
			matchType: dto.matchType,
			joinedAt: new Date()
		})
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
