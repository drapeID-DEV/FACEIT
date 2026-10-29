import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { LiveMatchService } from './live-match.service'

const SAMPLE_LOG = readFileSync(
	join(__dirname, '../../test/fixtures/cs2-sample.log'),
	'utf8'
)

function createService() {
	const prisma = {
		match: {
			findUnique: jest.fn().mockResolvedValue({
				id: 'm1',
				status: 'LIVE',
				team1Score: 0,
				team2Score: 0,
				participants: [
					{
						userId: 'u1',
						team: 1,
						kills: 0,
						deaths: 0,
						assists: 0,
						headshots: 0,
						user: { steamId: '76561197960266729' }
					},
					{
						userId: 'u2',
						team: 2,
						kills: 0,
						deaths: 0,
						assists: 0,
						headshots: 0,
						user: { steamId: '76561197960266730' }
					}
				]
			}),
			update: jest.fn()
		},
		matchParticipant: {
			updateMany: jest.fn(),
			findMany: jest.fn().mockResolvedValue([
				{ userId: 'u1', kills: 2, deaths: 1, assists: 0, headshots: 2, mvpRounds: 0 },
				{ userId: 'u2', kills: 1, deaths: 2, assists: 0, headshots: 0, mvpRounds: 0 }
			])
		},
		$transaction: jest.fn().mockResolvedValue([])
	}
	const emitter = { emit: jest.fn() }

	const service = new LiveMatchService(prisma as never, emitter as never)

	return { service, prisma, emitter }
}

async function flush(service: LiveMatchService) {
	await (service as unknown as { queues: Map<string, Promise<void>> }).queues.get('m1')
}

describe('LiveMatchService', () => {
	it('tracks kills, headshots and team scores from a log stream', async () => {
		const { service, emitter, prisma } = createService()

		service.handleLog('m1', SAMPLE_LOG)
		await flush(service)

		const liveStats = emitter.emit.mock.calls.filter(
			([event]) => event === 'match.liveStats'
		)
		const snapshot = liveStats[liveStats.length - 1][1]

		expect(snapshot).toMatchObject({ team1Score: 2, team2Score: 1, isLive: false })
		expect(snapshot.players).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ userId: 'u1', kills: 2, deaths: 1, headshots: 2 }),
				expect.objectContaining({ userId: 'u2', kills: 1, deaths: 2, headshots: 0 })
			])
		)

		// One save per Round_End plus one on Game Over
		expect(prisma.$transaction).toHaveBeenCalledTimes(4)

		expect(emitter.emit).toHaveBeenCalledWith(
			'match.gameOver',
			expect.objectContaining({ matchId: 'm1', winnerTeam: 1, team1Score: 2, team2Score: 1 })
		)
	})

	it('maps scores to platform teams after a side swap', async () => {
		const { service } = createService()

		service.handleLog(
			'm1',
			[
				'World triggered "Match_Start" on "de_dust2"',
				// Team 1 player is now on T
				'"PlayerOne<2><[U:1:1001]><TERRORIST>" [0 0 0] killed "PlayerTwo<3><[U:1:1002]><CT>" [0 0 0] with "ak47"',
				'Team "TERRORIST" scored "7" with "1" players',
				'Team "CT" scored "5" with "1" players'
			].join('\n')
		)
		await flush(service)

		expect(service.getSnapshot('m1')).toMatchObject({
			team1Score: 7,
			team2Score: 5,
			isLive: true,
			round: 13
		})
	})

	it('ignores unknown or non-live matches', async () => {
		const { service, prisma, emitter } = createService()
		prisma.match.findUnique.mockResolvedValueOnce({ status: 'FINISHED', participants: [] })

		service.handleLog('m1', SAMPLE_LOG)
		await flush(service)

		expect(emitter.emit).not.toHaveBeenCalled()
	})
})
