import { TeamGroup, buildTeams } from './build-teams'

function group(size: number, elo = 1000, minutesAgo = 0): TeamGroup {
	return {
		players: Array.from({ length: size }, () => ({ elo })),
		joinedAt: new Date(Date.now() - minutesAgo * 60_000)
	}
}

function teamSizes(teams: [TeamGroup[], TeamGroup[]] | null) {
	return teams?.map(team =>
		team.reduce((sum, entry) => sum + entry.players.length, 0)
	)
}

describe('buildTeams', () => {
	it('returns null until there are enough players', () => {
		const anchor = group(1)

		expect(buildTeams([group(1), group(1), anchor], anchor, 2, 300)).toBeNull()
	})

	it('matches ten solo players into two teams of five', () => {
		const entries = Array.from({ length: 10 }, () => group(1))

		const teams = buildTeams(entries, entries[0], 5, 300)

		expect(teamSizes(teams)).toEqual([5, 5])
	})

	it('keeps a party on one team', () => {
		const party = group(3)
		const solos = Array.from({ length: 7 }, () => group(1))

		const teams = buildTeams([...solos, party], party, 5, 300)

		expect(teamSizes(teams)).toEqual([5, 5])
		expect(teams?.filter(team => team.includes(party))).toHaveLength(1)
	})

	it('skips combinations that add up but cannot be split evenly', () => {
		const anchor = group(4)
		const other = group(4)
		const pair = group(2)
		const solos = [group(1), group(1)]

		// 4 + 4 + 2 is ten players, but no team can be exactly five
		expect(buildTeams([anchor, other, pair], anchor, 5, 300)).toBeNull()
		expect(
			teamSizes(buildTeams([anchor, other, ...solos], anchor, 5, 300))
		).toEqual([5, 5])
	})

	it('ignores groups outside the ELO range', () => {
		const anchor = group(1, 1000)
		const entries = [anchor, group(1, 1000), group(1, 1000), group(1, 1500)]

		expect(buildTeams(entries, anchor, 2, 300)).toBeNull()
	})

	it('prefers the players who waited longest', () => {
		const anchor = group(1, 1000, 0)
		const oldest = group(1, 1000, 10)
		const entries = [
			anchor,
			group(1, 1000, 1),
			group(1, 1000, 2),
			oldest,
			group(1, 1000, 3)
		]

		const teams = buildTeams(entries, anchor, 2, 300)

		expect(teams?.flat()).toContain(oldest)
	})

	it('balances the teams by average ELO', () => {
		const anchor = group(1, 1000)
		const entries = [anchor, group(1, 1000), group(1, 1200), group(1, 1200)]

		const teams = buildTeams(entries, anchor, 2, 300)
		const average = (team: TeamGroup[]) =>
			team.reduce((sum, entry) => sum + entry.players[0].elo, 0) / team.length

		expect(average(teams![0])).toBe(average(teams![1]))
	})
})
