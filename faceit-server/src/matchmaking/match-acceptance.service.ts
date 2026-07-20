import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

import { QueuePlayer } from './interfaces/queue-player.interface'

export interface MatchAcceptance {
	id: string
	players: QueuePlayer[]
	acceptedPlayers: Set<string>
	expiresAt: Date
	timeout: NodeJS.Timeout
}

@Injectable()
export class MatchAcceptanceService {
	private readonly acceptances = new Map<string, MatchAcceptance>()

	private expirationHandler?: (acceptance: MatchAcceptance) => void

	public onExpired(handler: (acceptance: MatchAcceptance) => void) {
		this.expirationHandler = handler
	}

	public create(players: QueuePlayer[]) {
		const acceptance = {} as MatchAcceptance

		acceptance.id = randomUUID()
		acceptance.players = players
		acceptance.acceptedPlayers = new Set()
		acceptance.expiresAt = new Date(Date.now() + 30_000)

		acceptance.timeout = setTimeout(() => {
			this.remove(acceptance.id)

			this.expirationHandler?.(acceptance)
		}, 30_000)

		this.acceptances.set(acceptance.id, acceptance)

		return acceptance
	}

	public get(id: string) {
		return this.acceptances.get(id)
	}

	public accept(acceptanceId: string, userId: string) {
		const acceptance = this.acceptances.get(acceptanceId)

		const isParticipant = acceptance.players.some(
			player => player.userId === userId
		)

		if (!isParticipant) {
			return null
		}

		if (!acceptance) {
			return null
		}

		if (acceptance.acceptedPlayers.has(userId)) {
			return acceptance
		}

		acceptance.acceptedPlayers.add(userId)

		return acceptance
	}

	public isAcceptedByAll(acceptance: MatchAcceptance) {
		return acceptance.acceptedPlayers.size === acceptance.players.length
	}

	public remove(id: string) {
		const acceptance = this.acceptances.get(id)

		if (!acceptance) {
			return
		}

		clearTimeout(acceptance.timeout)

		this.acceptances.delete(id)
	}
}
