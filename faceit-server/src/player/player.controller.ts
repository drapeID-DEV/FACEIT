import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'

import { MatchService } from '@/match/match.service'
import { UserService } from '@/user/user.service'

@Controller('player')
export class PlayerController {
	constructor(
		private readonly userService: UserService,
		private readonly matchService: MatchService
	) {}

	@HttpCode(HttpStatus.OK)
	@Get(':nickname/matches')
	public async findMatchesByUserNickname(
		@Param('nickname') nickname: string
	) {
		const user = await this.userService.findByNickname(nickname)

		return this.matchService.findMatchesByUserId(user.id)
	}
}
