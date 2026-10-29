import { parseLogLine, toSteamId64 } from './log-parser'

const PREFIX = 'L 10/29/2026 - 20:30:00: '

describe('toSteamId64', () => {
	it('converts SteamID3 and SteamID2', () => {
		expect(toSteamId64('[U:1:66138017]')).toBe('76561198026403745')
		expect(toSteamId64('STEAM_1:1:33069008')).toBe('76561198026403745')
		expect(toSteamId64('BOT')).toBeNull()
	})
})

describe('parseLogLine', () => {
	it('parses a headshot kill', () => {
		const event = parseLogLine(
			`${PREFIX}"Max <Pro>!<2><[U:1:66138017]><CT>" [-1180 1300 -120] killed "Bob<3><[U:1:1]><TERRORIST>" [-900 1200 -100] with "ak47" (headshot)`
		)

		expect(event).toEqual({
			type: 'kill',
			attacker: {
				name: 'Max <Pro>!',
				steamId: '76561198026403745',
				side: 'CT'
			},
			victim: {
				name: 'Bob',
				steamId: '76561197960265729',
				side: 'TERRORIST'
			},
			headshot: true
		})
	})

	it('parses a body kill without flags', () => {
		const event = parseLogLine(
			`${PREFIX}"A<2><[U:1:5]><CT>" [0 0 0] killed "B<3><[U:1:6]><TERRORIST>" [0 0 0] with "usp_silencer"`
		)

		expect(event).toMatchObject({ type: 'kill', headshot: false })
	})

	it('ignores kills of non-player entities', () => {
		expect(
			parseLogLine(
				`${PREFIX}"A<2><[U:1:5]><CT>" [0 0 0] killed other "chicken<105>" [0 0 0] with "knife"`
			)
		).toBeNull()
	})

	it('parses assists but not flash assists', () => {
		expect(
			parseLogLine(
				`${PREFIX}"A<2><[U:1:5]><CT>" assisted killing "B<3><[U:1:6]><TERRORIST>"`
			)
		).toMatchObject({ type: 'assist', assister: { steamId: '76561197960265733' } })

		expect(
			parseLogLine(
				`${PREFIX}"A<2><[U:1:5]><CT>" flash-assisted killing "B<3><[U:1:6]><TERRORIST>"`
			)
		).toBeNull()
	})

	it('parses suicide and team switch', () => {
		expect(
			parseLogLine(
				`${PREFIX}"A<2><[U:1:5]><CT>" [0 0 0] committed suicide with "world"`
			)
		).toMatchObject({ type: 'suicide', player: { side: 'CT' } })

		expect(
			parseLogLine(
				`${PREFIX}"A<2><[U:1:5]>" switched from team <Unassigned> to <TERRORIST>`
			)
		).toMatchObject({ type: 'switchTeam', player: { side: 'TERRORIST' } })
	})

	it('parses round and match lifecycle lines', () => {
		expect(
			parseLogLine(`${PREFIX}Team "TERRORIST" scored "7" with "1" players`)
		).toEqual({ type: 'teamScore', side: 'TERRORIST', score: 7 })
		expect(
			parseLogLine(`${PREFIX}World triggered "Match_Start" on "de_dust2"`)
		).toEqual({ type: 'matchStart' })
		expect(parseLogLine(`${PREFIX}World triggered "Round_End"`)).toEqual({
			type: 'roundEnd'
		})
		expect(
			parseLogLine(
				`${PREFIX}Game Over: competitive mg_active de_dust2 score 13:7 after 25 min`
			)
		).toEqual({ type: 'gameOver' })
		expect(parseLogLine(`${PREFIX}server cvars start`)).toBeNull()
	})
})
