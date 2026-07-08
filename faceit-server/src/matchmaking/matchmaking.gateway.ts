import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Match } from 'generated/prisma'
import { Server, Socket } from 'socket.io'

import { MatchWithParticipants } from '@/match/constants/match.constants'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	}
})
export class MatchmakingGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	private readonly connectedUsers = new Map<string, string>()

	@WebSocketServer()
	server: Server

	handleConnection(client: Socket) {
		const session = (client.request as any).session

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

	public notifyMatchFound(match: MatchWithParticipants) {
		for (const participant of match.participants) {
			const socketId = this.connectedUsers.get(participant.user.id)

			if (!socketId) {
				continue
			}

			this.server.to(socketId).emit('matchFound', match)
		}
	}
}
