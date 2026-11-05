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
export class NotificationGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server

	handleConnection(client: Socket) {
		const session = client.request.session

		if (session?.userId) {
			client.join(userRoom(session.userId))
		}
	}

	@OnEvent('notification.created')
	handleNotificationCreated({
		userId,
		notification
	}: {
		userId: string
		notification: unknown
	}) {
		this.server.to(userRoom(userId)).emit('notificationCreated', notification)
	}

	@OnEvent('notification.read')
	handleNotificationRead({ userId }: { userId: string }) {
		this.server.to(userRoom(userId)).emit('notificationsRead')
	}
}
