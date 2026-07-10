import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { Request } from 'express'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { UserService } from '@/user/user.service'

import { JoinQueueDto } from './dto/join-queue.dto'
import { MatchmakingService } from './matchmaking.service'

@Controller('matchmaking')
export class MatchmakingController {
	constructor(
		private readonly matchmakingService: MatchmakingService,
		private readonly userService: UserService
	) {}

	@Authorization()
	@Post('queue/join')
	async joinQueue(@Req() req: Request, @Body() dto: JoinQueueDto) {
		const user = await this.userService.findById(req.session.userId)

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
}
