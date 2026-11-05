import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'

import { PrismaService } from '@/prisma/prisma.service'

import { MatchStatus, NotificationType } from '../../generated/prisma'

const NOTIFICATIONS_LIMIT = 50

const notificationSelect = {
	id: true,
	type: true,
	matchId: true,
	eloChange: true,
	isRead: true,
	createdAt: true,
	actor: {
		select: {
			id: true,
			nickname: true,
			profilePic: true
		}
	}
}

interface CreateNotificationData {
	userId: string
	type: NotificationType
	actorId?: string
	matchId?: string
	eloChange?: number
}

@Injectable()
export class NotificationService {
	private readonly logger = new Logger(NotificationService.name)

	constructor(
		private readonly prismaService: PrismaService,
		private readonly eventEmitter: EventEmitter2
	) {}

	public async findAll(userId: string) {
		const [notifications, unreadCount] = await Promise.all([
			this.prismaService.notification.findMany({
				where: { userId },
				orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
				take: NOTIFICATIONS_LIMIT,
				select: notificationSelect
			}),

			this.prismaService.notification.count({
				where: { userId, isRead: false }
			})
		])

		return { notifications, unreadCount }
	}

	public async markAsRead(userId: string, id: string) {
		const { count } = await this.prismaService.notification.updateMany({
			where: { id, userId },
			data: { isRead: true }
		})

		if (count === 0) {
			throw new NotFoundException('Notification not found.')
		}

		this.eventEmitter.emit('notification.read', { userId })

		return { message: 'Notification marked as read.' }
	}

	public async markAllAsRead(userId: string) {
		await this.prismaService.notification.updateMany({
			where: { userId, isRead: false },
			data: { isRead: true }
		})

		this.eventEmitter.emit('notification.read', { userId })

		return { message: 'All notifications marked as read.' }
	}

	@OnEvent('friend.requested')
	public async handleFriendRequested({
		userId,
		actorId
	}: {
		userId: string
		actorId: string
	}) {
		await this.create({
			userId,
			actorId,
			type: NotificationType.FRIEND_REQUEST
		})
	}

	@OnEvent('friend.accepted')
	public async handleFriendAccepted({
		userId,
		actorId
	}: {
		userId: string
		actorId: string
	}) {
		await this.create({
			userId,
			actorId,
			type: NotificationType.FRIEND_ACCEPTED
		})
	}

	// Also fired when a match is cancelled, only a finished one has an ELO result
	@OnEvent('match.finished')
	public async handleMatchFinished({ matchId }: { matchId: string }) {
		try {
			const match = await this.prismaService.match.findUnique({
				where: { id: matchId },
				include: { participants: true }
			})

			if (match?.status !== MatchStatus.FINISHED) {
				return
			}

			for (const participant of match.participants) {
				await this.create({
					userId: participant.userId,
					type: NotificationType.MATCH_FINISHED,
					matchId,
					eloChange: participant.eloAfter - participant.eloBefore
				})
			}
		} catch (error) {
			this.logger.error(
				`Failed to notify about match ${matchId}: ${(error as Error).message}`
			)
		}
	}

	private async create(data: CreateNotificationData) {
		try {
			const notification = await this.prismaService.notification.create({
				data,
				select: notificationSelect
			})

			this.eventEmitter.emit('notification.created', {
				userId: data.userId,
				notification
			})
		} catch (error) {
			this.logger.error(
				`Failed to create ${data.type} notification: ${(error as Error).message}`
			)
		}
	}
}
