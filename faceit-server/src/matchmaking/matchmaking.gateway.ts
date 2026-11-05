import { Logger } from '@nestjs/common'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { userRoom } from '@/libs/common/utils/user-room.util'
import { MatchBanService } from '@/match/match-ban/match-ban.service'
import { MatchService } from '@/match/match.service'

import {
	MatchAcceptance,
	MatchAcceptanceService
} from './match-acceptance.service'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	}
})
export class MatchmakingGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(MatchmakingGateway.name)

	constructor(
		private readonly matchAcceptanceService: MatchAcceptanceService,
		private readonly matchService: MatchService,
		private readonly matchBanService: MatchBanService
	) {}

	@WebSocketServer()
	server: Server

	handleConnection(client: Socket) {
		const session = client.request.session

		if (!session?.userId) {
			client.disconnect()
			return
		}

		client.join(userRoom(session.userId))

		console.log(`User ${session.userId} connected (${client.id})`)
	}

	handleDisconnect(client: Socket) {
		const session = (client.request as any).session

		if (!session?.userId) {
			return
		}

		console.log(`User ${session.userId} disconnected`)
	}

	private emitToPlayers(
		acceptance: MatchAcceptance,
		event: string,
		payload: unknown
	) {
		for (const player of acceptance.players) {
			this.server.to(userRoom(player.userId)).emit(event, payload)
		}
	}

	@SubscribeMessage('acceptMatch')
	async handleAcceptMatch(
		@ConnectedSocket() client: Socket,
		@MessageBody() body: { acceptanceId: string }
	) {
		const session = client.request.session

		if (!session?.userId) {
			return
		}

		const acceptance = this.matchAcceptanceService.accept(
			body.acceptanceId,
			session.userId
		)

		if (!acceptance) {
			return
		}

		this.emitToPlayers(acceptance, 'acceptedUpdated', {
			acceptedPlayers: acceptance.acceptedPlayers.size,
			totalPlayers: acceptance.players.length
		})

		if (!this.matchAcceptanceService.isAcceptedByAll(acceptance)) {
			return
		}

		// Removed before the first await, a repeated accept must not create a second match
		this.matchAcceptanceService.remove(acceptance.id)

		try {
			const match = await this.matchService.create(
				acceptance.teams.map(team =>
					team.flatMap(entry =>
						entry.players.map(player => player.userId)
					)
				),
				acceptance.matchType
			)

			const banState = await this.matchBanService.start(match.id)

			this.emitToPlayers(acceptance, 'matchCreated', {
				id: match.id,
				status: match.status,
				banState
			})
		} catch (error) {
			this.logger.error(
				`Failed to create match: ${(error as Error).message}`
			)

			this.emitToPlayers(acceptance, 'matchCancelled', {
				reason: 'error',
				requeued: false
			})
		}
	}

	public notifyMatchReady(acceptance: MatchAcceptance) {
		this.emitToPlayers(acceptance, 'matchReady', {
			acceptanceId: acceptance.id,
			expiresAt: acceptance.expiresAt,
			acceptedPlayers: 0,
			totalPlayers: acceptance.players.length
		})
	}

	public notifyMatchCancelled(userId: string, requeued: boolean) {
		this.server.to(userRoom(userId)).emit('matchCancelled', {
			reason: 'timeout',
			requeued
		})
	}

	public notifyQueueUpdated(userIds: string[]) {
		for (const userId of userIds) {
			this.server.to(userRoom(userId)).emit('queueUpdated')
		}
	}
}
