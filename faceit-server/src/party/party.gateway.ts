import { OnEvent } from '@nestjs/event-emitter'
import {
	OnGatewayConnection,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { userRoom } from '@/libs/common/utils/user-room.util'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	}
})
export class PartyGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server

	handleConnection(client: Socket) {
		const session = client.request.session

		if (session?.userId) {
			client.join(userRoom(session.userId))
		}
	}

	@OnEvent('party.updated')
	handlePartyUpdated({ userIds }: { userIds: string[] }) {
		for (const userId of new Set(userIds)) {
			this.server.to(userRoom(userId)).emit('partyUpdated')
		}
	}

	@OnEvent('party.invited')
	handlePartyInvited({ userId }: { userId: string }) {
		this.server.to(userRoom(userId)).emit('partyInvite')
	}
}
