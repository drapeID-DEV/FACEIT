import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { MatchBanService } from './match-ban/match-ban.service'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	}
})
export class MatchGateway implements OnGatewayConnection {
	constructor(private readonly matchBanService: MatchBanService) {}

	@WebSocketServer()
	server: Server

	handleConnection(client: Socket) {
		const session = client.request.session

		if (!session?.userId) {
			client.disconnect()
		}
	}

	@SubscribeMessage('joinMatch')
	handleJoinMatch(
		@ConnectedSocket() client: Socket,
		@MessageBody() body: { matchId: string }
	) {
		client.join(body.matchId)
	}

	@SubscribeMessage('banMap')
	async handleBanMap(
		@ConnectedSocket() client: Socket,
		@MessageBody()
		body: {
			matchId: string
			map: string
		}
	) {
		const session = client.request.session

		if (!session?.userId) {
			return
		}

		const state = await this.matchBanService.banMap(
			body.matchId,
			session.userId,
			body.map
		)

		this.server.to(body.matchId).emit('mapBanUpdated', state)
	}
}
