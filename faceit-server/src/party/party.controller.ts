import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { PartyService } from './party.service'

@Controller('party')
export class PartyController {
	constructor(private readonly partyService: PartyService) {}

	@Authorization()
	@Get()
	getParty(@Authorized('id') userId: string) {
		return this.partyService.getState(userId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Post('invite/:userId')
	invite(
		@Authorized('id') userId: string,
		@Param('userId') targetUserId: string
	) {
		return this.partyService.invite(userId, targetUserId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Post('invites/:partyId/accept')
	acceptInvite(
		@Authorized('id') userId: string,
		@Param('partyId') partyId: string
	) {
		return this.partyService.acceptInvite(userId, partyId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Post('invites/:partyId/decline')
	declineInvite(
		@Authorized('id') userId: string,
		@Param('partyId') partyId: string
	) {
		return this.partyService.declineInvite(userId, partyId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Post('leave')
	leave(@Authorized('id') userId: string) {
		return this.partyService.leave(userId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Post('kick/:userId')
	kick(
		@Authorized('id') userId: string,
		@Param('userId') targetUserId: string
	) {
		return this.partyService.kick(userId, targetUserId)
	}
}
