import { OnEvent } from '@nestjs/event-emitter'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import {
	GameServerService,
	GameServerState
} from '@/game-server/game-server.service'
import {
	LiveMatchService,
	LiveMatchSnapshot
} from '@/game-server/live-match.service'

import { Match } from '../../generated/prisma'
import { MatchBanService } from './match-ban/match-ban.service'

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	}
})
export class MatchGateway implements OnGatewayConnection {
	constructor(
		private readonly matchBanService: MatchBanService,
		private readonly gameServerService: GameServerService,
		private readonly liveMatchService: LiveMatchService
	) {}

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
		const session = client.request.session

		if (!session?.userId || !body?.matchId) {
			return
		}

		client.join(body.matchId)

		// Late joiners and page reloads still get the current server state
		const serverState = this.gameServerService.getState(body.matchId)

		if (serverState) {
			client.emit('serverStatus', this.toServerStatusPayload(serverState))
		}

		const liveStats = this.liveMatchService.getSnapshot(body.matchId)

		if (liveStats) {
			client.emit('liveStats', liveStats)
		}
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

		await this.matchBanService.banMap(
			body.matchId,
			session.userId,
			body.map
		)
	}

	@OnEvent('match.mapBanUpdated')
	handleMapBanUpdated(payload: { matchId: string; match: Match }) {
		this.server.to(payload.matchId).emit('mapBanUpdated', payload.match)
	}

	@OnEvent('match.serverStatus')
	handleServerStatus(state: GameServerState) {
		this.server
			.to(state.matchId)
			.emit('serverStatus', this.toServerStatusPayload(state))
	}

	@OnEvent('match.liveStats')
	handleLiveStats(snapshot: LiveMatchSnapshot) {
		this.server.to(snapshot.matchId).emit('liveStats', snapshot)
	}

	@OnEvent('match.finished')
	handleMatchFinished(payload: { matchId: string }) {
		this.server.to(payload.matchId).emit('matchFinished', payload)
	}

	private toServerStatusPayload(state: GameServerState) {
		return {
			status: state.status,
			address: state.address,
			map: state.map,
			error: state.error
		}
	}
}
