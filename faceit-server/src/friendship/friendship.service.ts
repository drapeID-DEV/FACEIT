import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { FriendshipStatus } from '../../generated/prisma'
import { FriendshipStatusResponse } from './frienship-status/frienship-status'

@Injectable()
export class FriendshipService {
	public constructor(private readonly prismaService: PrismaService) {}

	private getUserPair(userId: string, targetUserId: string) {
		return userId < targetUserId
			? {
					user1Id: userId,
					user2Id: targetUserId
				}
			: {
					user1Id: targetUserId,
					user2Id: userId
				}
	}

	public async addFriend(userId: string, targetUserId: string) {
		if (userId === targetUserId) {
			throw new BadRequestException(
				'You cannot add yourself as a friend.'
			)
		}

		const targetUser = await this.prismaService.user.findUnique({
			where: {
				id: targetUserId
			},
			select: {
				id: true
			}
		})

		if (!targetUser) {
			throw new NotFoundException('User not found.')
		}

		const pair = this.getUserPair(userId, targetUserId)

		const friendship = await this.prismaService.friendship.findUnique({
			where: {
				user1Id_user2Id: pair
			}
		})

		// No existing relationship
		if (!friendship) {
			return this.prismaService.friendship.create({
				data: {
					...pair,
					requesterId: userId,
					status: FriendshipStatus.PENDING
				}
			})
		}

		// Already friends
		if (friendship.status === FriendshipStatus.ACCEPTED) {
			throw new ConflictException('You are already friends.')
		}

		// Current user already sent the request
		if (friendship.requesterId === userId) {
			throw new ConflictException('Friend request already sent.')
		}

		// The other user sent the request first.
		// Accept it automatically.
		return this.prismaService.friendship.update({
			where: {
				id: friendship.id
			},
			data: {
				status: FriendshipStatus.ACCEPTED
			}
		})
	}

	public async acceptFriendRequest(userId: string, requesterId: string) {
		const pair = this.getUserPair(userId, requesterId)

		const friendship = await this.prismaService.friendship.findUnique({
			where: {
				user1Id_user2Id: pair
			}
		})

		if (!friendship) {
			throw new NotFoundException('Friend request not found.')
		}

		if (friendship.status === FriendshipStatus.ACCEPTED) {
			throw new ConflictException('You are already friends.')
		}

		if (friendship.requesterId !== requesterId) {
			throw new BadRequestException(
				'This user did not send you a friend request.'
			)
		}

		return this.prismaService.friendship.update({
			where: {
				id: friendship.id
			},
			data: {
				status: FriendshipStatus.ACCEPTED
			}
		})
	}

	public async declineFriendRequest(userId: string, requesterId: string) {
		const pair = this.getUserPair(userId, requesterId)

		const friendship = await this.prismaService.friendship.findUnique({
			where: {
				user1Id_user2Id: pair
			}
		})

		if (!friendship) {
			throw new NotFoundException('Friend request not found.')
		}

		if (friendship.status !== FriendshipStatus.PENDING) {
			throw new BadRequestException(
				'This is not a pending friend request.'
			)
		}

		if (friendship.requesterId !== requesterId) {
			throw new BadRequestException(
				'This user did not send you a friend request.'
			)
		}

		await this.prismaService.friendship.delete({
			where: {
				id: friendship.id
			}
		})

		return {
			message: 'Friend request declined successfully.'
		}
	}

	public async removeFriend(userId: string, targetUserId: string) {
		const pair = this.getUserPair(userId, targetUserId)

		const friendship = await this.prismaService.friendship.findUnique({
			where: {
				user1Id_user2Id: pair
			}
		})

		if (!friendship) {
			throw new NotFoundException('Friendship not found.')
		}

		if (friendship.status !== FriendshipStatus.ACCEPTED) {
			throw new BadRequestException('You are not friends with this user.')
		}

		await this.prismaService.friendship.delete({
			where: {
				id: friendship.id
			}
		})

		return {
			message: 'Friend removed successfully.'
		}
	}

	public async getFriends(userId: string) {
		const friendships = await this.prismaService.friendship.findMany({
			where: {
				status: FriendshipStatus.ACCEPTED,
				OR: [{ user1Id: userId }, { user2Id: userId }]
			},
			include: {
				user1: {
					select: {
						id: true,
						nickname: true,
						profilePic: true,
						elo: true
					}
				},
				user2: {
					select: {
						id: true,
						nickname: true,
						profilePic: true,
						elo: true
					}
				}
			}
		})

		return friendships.map(friendship =>
			friendship.user1Id === userId ? friendship.user2 : friendship.user1
		)
	}

	public async getFriendRequests(userId: string) {
		const friendships = await this.prismaService.friendship.findMany({
			where: {
				status: FriendshipStatus.PENDING,
				requesterId: {
					not: userId
				},
				OR: [{ user1Id: userId }, { user2Id: userId }]
			},
			include: {
				requester: {
					select: {
						id: true,
						nickname: true,
						profilePic: true,
						elo: true
					}
				}
			}
		})

		return friendships.map(friendship => friendship.requester)
	}

	public async getFriendshipStatus(userId: string, targetUserId: string) {
		if (userId === targetUserId) {
			return {
				status: FriendshipStatusResponse.SELF
			}
		}

		const pair = this.getUserPair(userId, targetUserId)

		const friendship = await this.prismaService.friendship.findUnique({
			where: {
				user1Id_user2Id: pair
			}
		})

		if (!friendship) {
			return {
				status: FriendshipStatusResponse.NONE
			}
		}

		if (friendship.status === FriendshipStatus.ACCEPTED) {
			return {
				status: FriendshipStatusResponse.FRIENDS
			}
		}

		return {
			status:
				friendship.requesterId === userId
					? FriendshipStatusResponse.REQUEST_SENT
					: FriendshipStatusResponse.REQUEST_RECEIVED
		}
	}
}
