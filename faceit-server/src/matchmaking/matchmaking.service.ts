import { Injectable, NotFoundException } from '@nestjs/common'

import { MatchService } from '@/match/match.service'

import { QueuePlayer } from './interfaces/queue-player.interface'
import { MatchAcceptanceService } from './match-acceptance.service'
import { MatchmakingGateway } from './matchmaking.gateway'

@Injectable()
export class MatchmakingService {
	constructor(
		private readonly matchService: MatchService,
		private readonly matchmakingGateway: MatchmakingGateway,
		private readonly matchAcceptanceService: MatchAcceptanceService
	) {}

	private readonly queue: QueuePlayer[] = []

	public async joinQueue(player: QueuePlayer) {
		const activeMatch = await this.matchService.findActiveMatchByUserId(
			player.userId
		)

		if (activeMatch) {
			return {
				message: 'You already have an active match.',
				matchId: activeMatch.id
			}
		}

		const exists = this.queue.some(
			queuePlayer => queuePlayer.userId === player.userId
		)

		if (exists) {
			return {
				message: 'Player is already in queue.'
			}
		}

		this.queue.push(player)

		await this.findOpponent(player)

		return {
			message: 'Searching for opponent...'
		}
	}

	public leaveQueue(userId: string) {
		const index = this.queue.findIndex(player => player.userId === userId)

		if (index === -1) {
			throw new NotFoundException('No such user in the queue')
		}

		this.queue.splice(index, 1)

		return { message: 'You left the queue' }
	}

	public async findOpponent(player: QueuePlayer) {
		const opponent = this.queue.find(queuePlayer => {
			if (queuePlayer.userId === player.userId) {
				return false
			}

			if (queuePlayer.matchType !== player.matchType) {
				return false
			}

			return Math.abs(queuePlayer.elo - player.elo) <= 100
		})

		if (!opponent) {
			return null
		}

		this.leaveQueue(player.userId)
		this.leaveQueue(opponent.userId)

		const acceptance = this.matchAcceptanceService.create([
			player,
			opponent
		])

		this.matchmakingGateway.notifyMatchReady(acceptance)

		return acceptance
	}

	public getQueueStatus(userId: string) {
		const player = this.queue.find(p => p.userId === userId)

		return {
			inQueue: !!player,
			queuePosition: player
				? this.queue.findIndex(p => p.userId === userId) + 1
				: null,
			queueSize: this.queue.length,
			matchType: player?.matchType || null,
			joinedAt: player?.joinedAt || null
		}
	}
}
