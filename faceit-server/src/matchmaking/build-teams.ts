export interface TeamGroup {
	players: { elo: number }[]
	joinedAt: Date
}

function averageElo(groups: TeamGroup[]) {
	const players = groups.flatMap(group => group.players)

	return players.reduce((sum, player) => sum + player.elo, 0) / players.length
}

function sizeOf(groups: TeamGroup[]) {
	return groups.reduce((sum, group) => sum + group.players.length, 0)
}

// Splits groups into two teams of exactly teamSize with the smallest average ELO gap
function splitIntoTeams<T extends TeamGroup>(
	groups: T[],
	teamSize: number
): [T[], T[]] | null {
	let best: [T[], T[]] | null = null
	let bestGap = Infinity

	for (let mask = 0; mask < 1 << groups.length; mask++) {
		const team1 = groups.filter((_, index) => mask & (1 << index))

		if (sizeOf(team1) !== teamSize) {
			continue
		}

		const team2 = groups.filter((_, index) => !(mask & (1 << index)))
		const gap = Math.abs(averageElo(team1) - averageElo(team2))

		if (gap < bestGap) {
			best = [team1, team2]
			bestGap = gap
		}
	}

	return best
}

/**
 * Looks for two full teams that include the anchor (the group that just joined),
 * preferring whoever has been waiting longest. Parties always stay together.
 */
export function buildTeams<T extends TeamGroup>(
	entries: T[],
	anchor: T,
	teamSize: number,
	eloRange: number
): [T[], T[]] | null {
	const anchorElo = averageElo([anchor])

	const candidates = entries
		.filter(
			entry =>
				entry !== anchor &&
				Math.abs(averageElo([entry]) - anchorElo) <= eloRange
		)
		.sort((a, b) => a.joinedAt.getTime() - b.joinedAt.getTime())

	const search = (
		chosen: T[],
		from: number,
		players: number
	): [T[], T[]] | null => {
		if (players === teamSize * 2) {
			return splitIntoTeams(chosen, teamSize)
		}

		for (let index = from; index < candidates.length; index++) {
			const candidate = candidates[index]
			const nextPlayers = players + candidate.players.length

			if (nextPlayers > teamSize * 2) {
				continue
			}

			const teams = search([...chosen, candidate], index + 1, nextPlayers)

			if (teams) {
				return teams
			}
		}

		return null
	}

	return search([anchor], 0, anchor.players.length)
}
