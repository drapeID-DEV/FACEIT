import { Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { FriendshipService } from './friendship.service'

@Controller('friends')
export class FriendshipController {
	public constructor(private readonly friendshipService: FriendshipService) {}

	@Authorization()
	@Post(':userId')
	public addFriend(
		@Authorized('id') userId: string,
		@Param('userId') targetUserId: string
	) {
		return this.friendshipService.addFriend(userId, targetUserId)
	}

	@Authorization()
	@Post(':userId/accept')
	public acceptFriendRequest(
		@Authorized('id') userId: string,
		@Param('userId') requesterId: string
	) {
		return this.friendshipService.acceptFriendRequest(userId, requesterId)
	}

	@Authorization()
	@Post(':userId/decline')
	public declineFriendRequest(
		@Authorized('id') userId: string,
		@Param('userId') requesterId: string
	) {
		return this.friendshipService.declineFriendRequest(userId, requesterId)
	}

	@Authorization()
	@Delete(':userId')
	public removeFriend(
		@Authorized('id') userId: string,
		@Param('userId') targetUserId: string
	) {
		return this.friendshipService.removeFriend(userId, targetUserId)
	}

	@Authorization()
	@Get()
	public getFriends(@Authorized('id') userId: string) {
		return this.friendshipService.getFriends(userId)
	}

	@Authorization()
	@Get('requests')
	public getFriendRequests(@Authorized('id') userId: string) {
		return this.friendshipService.getFriendRequests(userId)
	}

	@Authorization()
	@Get('status/:userId')
	public getFriendshipStatus(
		@Authorized('id') userId: string,
		@Param('userId') targetUserId: string
	) {
		return this.friendshipService.getFriendshipStatus(userId, targetUserId)
	}
}
