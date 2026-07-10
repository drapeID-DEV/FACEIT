import { Controller, Get, Param } from '@nestjs/common'

import { StatsService } from './stats.service'

@Controller('stats')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	@Get(':userId')
	public async getPlayerStats(@Param('userId') userId: string) {
		return this.statsService.findByUserId(userId)
	}
}
