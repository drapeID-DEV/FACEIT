import { MatchParticipant } from 'generated/prisma'

export function getRandomLeader(players: MatchParticipant[]) {
	return players[Math.floor(Math.random() * players.length)]
}
