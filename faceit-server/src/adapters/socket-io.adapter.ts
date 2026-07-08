import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'

export class SocketIoAdapter extends IoAdapter {
	constructor(
		app: INestApplicationContext,
		private readonly sessionMiddleware: any
	) {
		super(app)
	}

	override createIOServer(port: number, options?: ServerOptions) {
		const server = super.createIOServer(port, {
			...options,
			cors: {
				origin: 'http://localhost:3000',
				credentials: true
			}
		})

		server.use((socket, next) => {
			this.sessionMiddleware(socket.request, {} as any, next as any)
		})

		return server
	}
}
