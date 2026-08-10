import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { LeaderboardQueryDto } from './dto/leaderboard-query.dto'
import { LeaderboardService } from './leaderboard.service'

@Controller('leaderboard')
export class LeaderboardController {
	constructor(private readonly leaderboardService: LeaderboardService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get()
	async getLeaderboard(@Query() query: LeaderboardQueryDto) {
		return this.leaderboardService.getLeaderboard(query)
	}

	@Authorization()
	@Get('me')
	@HttpCode(HttpStatus.OK)
	public async getMyRank(@Authorized('id') userId: string) {
		return this.leaderboardService.getMyRank(userId)
	}
}
