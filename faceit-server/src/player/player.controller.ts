import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { MatchService } from '@/match/match.service'
import { StatsService } from '@/stats/stats.service'
import { UserService } from '@/user/user.service'

@Controller('player')
export class PlayerController {
	constructor(
		private readonly userService: UserService,
		private readonly matchService: MatchService,
		private readonly statsService: StatsService
	) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get(':nickname/matches')
	public async findMatchesByUserNickname(
		@Param('nickname') nickname: string
	) {
		const user = await this.userService.findByNickname(nickname)

		return this.matchService.findMatchesByUserId(user.id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get(':nickname/elo-history')
	async getEloHistory(@Param('nickname') nickname: string) {
		const user = await this.userService.findByNickname(nickname)

		return this.statsService.getEloHistory(user.id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get(':nickname/statistics')
	async getPlayerStatistics(@Param('nickname') nickname: string) {
		const user = await this.userService.findByNickname(nickname)

		return this.statsService.getPlayerStatistics(user.id)
	}
}
