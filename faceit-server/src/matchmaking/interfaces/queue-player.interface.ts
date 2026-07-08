import { MatchType } from 'generated/prisma'

export interface QueuePlayer {
	userId: string
	elo: number
	matchType: MatchType
	joinedAt: Date
}
