import { MatchType } from '../../../generated/prisma'

export interface QueuePlayer {
	userId: string
	elo: number
}

// A solo player or a whole party, the queue never splits a group
export interface QueueEntry {
	id: string
	partyId: string | null
	matchType: MatchType
	players: QueuePlayer[]
	joinedAt: Date
}
