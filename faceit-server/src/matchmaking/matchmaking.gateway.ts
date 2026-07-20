import { OnModuleInit } from '@nestjs/common'
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
	implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
	constructor(
		private readonly matchAcceptanceService: MatchAcceptanceService,
		private readonly matchService: MatchService
	) {}

	private readonly connectedUsers = new Map<string, string>()

	@WebSocketServer()
	server: Server

	onModuleInit() {
		this.matchAcceptanceService.onExpired(acceptance => {
			for (const player of acceptance.players) {
				const socketId = this.connectedUsers.get(player.userId)

				if (!socketId) {
					continue
				}

				this.server.to(socketId).emit('matchCancelled', {
					reason: 'timeout'
				})
			}
		})
	}

	handleConnection(client: Socket) {
		const session = client.request.session

		if (!session?.userId) {
			client.disconnect()
			return
		}

		this.connectedUsers.set(session.userId, client.id)

		console.log(`User ${session.userId} connected (${client.id})`)
	}

	handleDisconnect(client: Socket) {
		const session = (client.request as any).session

		if (!session?.userId) {
			return
		}

		this.connectedUsers.delete(session.userId)

		console.log(`User ${session.userId} disconnected`)
	}

	private emitToPlayers(
		acceptance: MatchAcceptance,
		event: string,
		payload: unknown
	) {
		for (const player of acceptance.players) {
			const socketId = this.connectedUsers.get(player.userId)

			if (!socketId) {
				continue
			}

			this.server.to(socketId).emit(event, payload)
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

		const match = await this.matchService.create(
			acceptance.players.map(player => player.userId)
		)

		this.matchAcceptanceService.remove(acceptance.id)

		this.emitToPlayers(acceptance, 'matchCreated', match)
	}

	public notifyMatchReady(acceptance: MatchAcceptance) {
		for (const player of acceptance.players) {
			const socketId = this.connectedUsers.get(player.userId)

			if (!socketId) continue

			this.server.to(socketId).emit('matchReady', {
				acceptanceId: acceptance.id,
				expiresAt: acceptance.expiresAt,
				acceptedPlayers: 0,
				totalPlayers: acceptance.players.length
			})
		}
	}
}
