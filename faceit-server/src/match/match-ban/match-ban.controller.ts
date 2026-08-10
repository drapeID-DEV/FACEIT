import { Controller, Get, Param, Session } from '@nestjs/common'
import { SessionData } from 'express-session'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { MatchBanService } from './match-ban.service'

@Controller('match')
export class MatchBanController {
	constructor(private readonly matchBanService: MatchBanService) {}

	@Authorization()
	@Get(':id/map-ban')
	async getMapBan(
		@Param('id') matchId: string,
		@Session() session: SessionData
	) {
		return this.matchBanService.getState(matchId, session.userId)
	}
}
