import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common'
import { Request } from 'express'

import { FriendshipService } from './friendship.service'

@Controller('friends')
export class FriendshipController {
	public constructor(private readonly friendshipService: FriendshipService) {}

	@Post(':userId')
	public addFriend(
		@Req() req: Request,
		@Param('userId') targetUserId: string
	) {
		return this.friendshipService.addFriend(
			req.session.userId,
			targetUserId
		)
	}

	@Post(':userId/accept')
	public acceptFriendRequest(
		@Req() req: Request,
		@Param('userId') requesterId: string
	) {
		return this.friendshipService.acceptFriendRequest(
			req.session.userId,
			requesterId
		)
	}

	@Post(':userId/decline')
	public declineFriendRequest(
		@Req() req: Request,
		@Param('userId') requesterId: string
	) {
		return this.friendshipService.declineFriendRequest(
			req.session.userId,
			requesterId
		)
	}

	@Delete(':userId')
	public removeFriend(
		@Req() req: Request,
		@Param('userId') targetUserId: string
	) {
		return this.friendshipService.removeFriend(
			req.session.userId,
			targetUserId
		)
	}

	@Get()
	public getFriends(@Req() req: Request) {
		return this.friendshipService.getFriends(req.session.userId)
	}

	@Get('requests')
	public getFriendRequests(@Req() req: Request) {
		return this.friendshipService.getFriendRequests(req.session.userId)
	}

	@Get('status/:userId')
	public getFriendshipStatus(
		@Req() req: Request,
		@Param('userId') targetUserId: string
	) {
		return this.friendshipService.getFriendshipStatus(
			req.session.userId,
			targetUserId
		)
	}
}
