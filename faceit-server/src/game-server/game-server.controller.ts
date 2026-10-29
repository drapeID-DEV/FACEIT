import {
	Body,
	Controller,
	ForbiddenException,
	HttpCode,
	Param,
	Post
} from '@nestjs/common'
import { timingSafeEqual } from 'node:crypto'

import { LiveMatchService } from './live-match.service'

// Receives `logaddress_add_http` POSTs from the CS2 server (plain text, one log line per row)
@Controller('game-server')
export class GameServerController {
	constructor(private readonly liveMatchService: LiveMatchService) {}

	@Post(':matchId/log/:token')
	@HttpCode(200)
	receiveLog(
		@Param('matchId') matchId: string,
		@Param('token') token: string,
		@Body() body: unknown
	) {
		const expected = process.env.CS2_LOG_TOKEN

		if (
			!expected ||
			token.length !== expected.length ||
			!timingSafeEqual(Buffer.from(token), Buffer.from(expected))
		) {
			throw new ForbiddenException()
		}

		if (typeof body === 'string') {
			this.liveMatchService.handleLog(matchId, body)
		}
	}
}
