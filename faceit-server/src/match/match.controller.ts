import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common'
import { Request } from 'express'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { FinishMatchDto } from './dto/finish-match.dto'
import { MatchService } from './match.service'

@Controller('match')
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Get('current')
	@Authorization()
	async getCurrentMatch(@Req() req: Request) {
		const match = await this.matchService.findActiveMatchByUserId(
			req.session.userId
		)

		if (match)
			return {
				hasActiveMatch: true,
				match
			}
		else
			return {
				hasActiveMatch: false,
				match: null
			}
	}

	@Get(':id')
	async getMatch(@Param('id') matchId: string) {
		return this.matchService.findById(matchId)
	}

	@Patch(':id/start')
	async startMatch(@Param('id') matchId: string) {
		return this.matchService.startMatch(matchId)
	}

	@Patch(':id/finish')
	async finishMatch(
		@Param('id') matchId: string,
		@Body() dto: FinishMatchDto
	) {
		return this.matchService.finishMatch(matchId, dto)
	}

	@Patch(':id/cancel')
	async cancelMatch(@Param('id') matchId: string) {
		return this.matchService.cancelMatch(matchId)
	}
}
