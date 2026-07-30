import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'

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

	@HttpCode(HttpStatus.OK)
	@Get(':nickname/matches')
	public async findMatchesByUserNickname(
		@Param('nickname') nickname: string
	) {
		const user = await this.userService.findByNickname(nickname)

		return this.matchService.findMatchesByUserId(user.id)
	}

	@HttpCode(HttpStatus.OK)
	@Get(':nickname/elo-history')
	async getEloHistory(@Param('nickname') nickname: string) {
		const user = await this.userService.findByNickname(nickname)

		return this.statsService.getEloHistory(user.id)
	}
}
