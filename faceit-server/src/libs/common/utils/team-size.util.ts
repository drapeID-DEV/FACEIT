const DEFAULT_TEAM_SIZE = 5

// TEAM_MATCH_SIZE lets a demo run with fewer accounts, e.g. 2 for a 2v2
export function parseTeamSize(value?: string): number {
	const size = Number(value)

	return Number.isInteger(size) && size >= 2 && size <= 5
		? size
		: DEFAULT_TEAM_SIZE
}
