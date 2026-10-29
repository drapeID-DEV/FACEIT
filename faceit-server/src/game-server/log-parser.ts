export type Side = 'CT' | 'TERRORIST'

export interface LogPlayer {
	name: string
	// SteamID64, null for bots
	steamId: string | null
	side: Side | null
}

export type LogEvent =
	| { type: 'kill'; attacker: LogPlayer; victim: LogPlayer; headshot: boolean }
	| { type: 'assist'; assister: LogPlayer; victim: LogPlayer }
	| { type: 'suicide'; player: LogPlayer }
	| { type: 'switchTeam'; player: LogPlayer }
	| { type: 'teamScore'; side: Side; score: number }
	| { type: 'matchStart' }
	| { type: 'roundEnd' }
	| { type: 'gameOver' }

const STEAM_ID64_BASE = 76561197960265728n

// "Name<12><[U:1:123456]><CT>"
const PLAYER = '"(.+?)<\\d+><([^>]*)><([^>]*)>"'
const POSITION = '(?: \\[[^\\]]*\\])?'

const KILL = new RegExp(
	`${PLAYER}${POSITION} killed ${PLAYER}${POSITION} with "[^"]*"(?: \\(([^)]*)\\))?`
)
const ASSIST = new RegExp(`${PLAYER} assisted killing ${PLAYER}`)
const SUICIDE = new RegExp(`${PLAYER}${POSITION} committed suicide with`)
const SWITCH_TEAM =
	/"(.+?)<\d+><([^>]*)>" switched from team <[^>]*> to <([^>]*)>/
const TEAM_SCORE = /Team "(CT|TERRORIST)" scored "(\d+)" with "\d+" players/
const MATCH_START = /World triggered "Match_Start"/
const ROUND_END = /World triggered "Round_End"/
const GAME_OVER = /Game Over:/

export function toSteamId64(raw: string): string | null {
	const steam3 = /^\[U:1:(\d+)\]$/.exec(raw)
	if (steam3) {
		return (STEAM_ID64_BASE + BigInt(steam3[1])).toString()
	}

	const steam2 = /^STEAM_\d:([01]):(\d+)$/.exec(raw)
	if (steam2) {
		return (
			STEAM_ID64_BASE +
			BigInt(steam2[2]) * 2n +
			BigInt(steam2[1])
		).toString()
	}

	if (/^7656119\d{10}$/.test(raw)) {
		return raw
	}

	return null
}

function toSide(raw: string): Side | null {
	return raw === 'CT' || raw === 'TERRORIST' ? raw : null
}

function player(name: string, steam: string, side: string): LogPlayer {
	return { name, steamId: toSteamId64(steam), side: toSide(side) }
}

export function parseLogLine(line: string): LogEvent | null {
	let match: RegExpExecArray | null

	if ((match = KILL.exec(line))) {
		return {
			type: 'kill',
			attacker: player(match[1], match[2], match[3]),
			victim: player(match[4], match[5], match[6]),
			headshot: match[7]?.includes('headshot') ?? false
		}
	}

	if ((match = ASSIST.exec(line))) {
		return {
			type: 'assist',
			assister: player(match[1], match[2], match[3]),
			victim: player(match[4], match[5], match[6])
		}
	}

	if ((match = SUICIDE.exec(line))) {
		return { type: 'suicide', player: player(match[1], match[2], match[3]) }
	}

	if ((match = SWITCH_TEAM.exec(line))) {
		return {
			type: 'switchTeam',
			player: player(match[1], match[2], match[3])
		}
	}

	if ((match = TEAM_SCORE.exec(line))) {
		return {
			type: 'teamScore',
			side: match[1] as Side,
			score: Number(match[2])
		}
	}

	if (MATCH_START.test(line)) return { type: 'matchStart' }
	if (ROUND_END.test(line)) return { type: 'roundEnd' }
	if (GAME_OVER.test(line)) return { type: 'gameOver' }

	return null
}
