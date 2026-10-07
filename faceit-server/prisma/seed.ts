import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { Pool } from 'pg'

import { PrismaClient } from '../generated/prisma'

const pool = new Pool({
	connectionString: process.env.POSTGRES_URI
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
	adapter
})

const MATCHES = [
	{
		kills: 12,
		deaths: 17,
		assists: 4,
		headshots: 4,
		mvpRounds: 0,
		won: false,
		team1Score: 8,
		team2Score: 13
	},
	{
		kills: 14,
		deaths: 16,
		assists: 5,
		headshots: 5,
		mvpRounds: 0,
		won: false,
		team1Score: 10,
		team2Score: 13
	},
	{
		kills: 15,
		deaths: 18,
		assists: 6,
		headshots: 6,
		mvpRounds: 1,
		won: false,
		team1Score: 11,
		team2Score: 13
	},
	{
		kills: 17,
		deaths: 15,
		assists: 7,
		headshots: 7,
		mvpRounds: 1,
		won: true,
		team1Score: 13,
		team2Score: 9
	},
	{
		kills: 13,
		deaths: 16,
		assists: 4,
		headshots: 5,
		mvpRounds: 0,
		won: false,
		team1Score: 9,
		team2Score: 13
	},
	{
		kills: 16,
		deaths: 14,
		assists: 6,
		headshots: 7,
		mvpRounds: 1,
		won: true,
		team1Score: 13,
		team2Score: 10
	},
	{
		kills: 11,
		deaths: 17,
		assists: 3,
		headshots: 4,
		mvpRounds: 0,
		won: false,
		team1Score: 7,
		team2Score: 13
	},
	{
		kills: 18,
		deaths: 15,
		assists: 8,
		headshots: 9,
		mvpRounds: 1,
		won: true,
		team1Score: 13,
		team2Score: 11
	},
	{
		kills: 14,
		deaths: 17,
		assists: 5,
		headshots: 5,
		mvpRounds: 0,
		won: false,
		team1Score: 10,
		team2Score: 13
	},
	{
		kills: 15,
		deaths: 16,
		assists: 6,
		headshots: 6,
		mvpRounds: 0,
		won: false,
		team1Score: 11,
		team2Score: 13
	}
]

const MAPS = [
	'de_mirage',
	'de_inferno',
	'de_nuke',
	'de_ancient',
	'de_anubis',
	'de_vertigo',
	'de_dust2'
]

async function main() {
	const player = await prisma.user.findUnique({
		where: {
			nickname: 'drape'
		}
	})

	if (!player) {
		throw new Error('Player "drape" not found')
	}

	let opponent = await prisma.user.findUnique({
		where: {
			nickname: 'test_opponent'
		}
	})

	if (!opponent) {
		opponent = await prisma.user.create({
			data: {
				email: 'test_opponent@faceit.local',
				nickname: 'test_opponent',
				elo: 1000,
				method: 'CREDENTIALS',
				isVerified: true
			}
		})

		await prisma.playerStats.create({
			data: {
				userId: opponent.id
			}
		})
	}

	let playerElo = player.elo
	let opponentElo = opponent.elo

	for (let i = 0; i < MATCHES.length; i++) {
		const data = MATCHES[i]

		const playerEloBefore = playerElo
		const opponentEloBefore = opponentElo

		const playerEloChange = data.won ? 25 : -25
		const opponentEloChange = data.won ? -25 : 25

		const playerEloAfter = playerEloBefore + playerEloChange
		const opponentEloAfter = opponentEloBefore + opponentEloChange

		const createdAt = new Date()

		createdAt.setDate(createdAt.getDate() - (MATCHES.length - i))

		const match = await prisma.match.create({
			data: {
				matchType: 'ONE_VS_ONE',
				maxPlayersPerTeam: 1,
				status: 'FINISHED',

				availableMaps: MAPS,
				selectedMap: MAPS[i % MAPS.length],

				winnerTeam: data.won ? 1 : 2,

				team1Score: data.won ? data.team1Score : data.team2Score,

				team2Score: data.won ? data.team2Score : data.team1Score,

				createdAt,
				updatedAt: createdAt,
				finishedAt: new Date(createdAt.getTime() + 40 * 60 * 1000),

				participants: {
					create: [
						{
							userId: player.id,
							team: 1,
							isWinner: data.won,
							eloBefore: playerEloBefore,
							eloAfter: playerEloAfter,

							kills: data.kills,
							deaths: data.deaths,
							assists: data.assists,
							headshots: data.headshots,
							mvpRounds: data.mvpRounds
						},
						{
							userId: opponent.id,
							team: 2,
							isWinner: !data.won,
							eloBefore: opponentEloBefore,
							eloAfter: opponentEloAfter,

							kills: data.won ? 15 : 18,
							deaths: data.won ? 18 : 15,
							assists: 5,
							headshots: 7,
							mvpRounds: data.won ? 1 : 2
						}
					]
				}
			}
		})

		await prisma.eloHistory.create({
			data: {
				userId: player.id,
				matchId: match.id,
				eloChange: playerEloChange,
				eloBefore: playerEloBefore,
				eloAfter: playerEloAfter,
				calculationMethod: 'fixed_25',
				createdAt
			}
		})

		await prisma.eloHistory.create({
			data: {
				userId: opponent.id,
				matchId: match.id,
				eloChange: opponentEloChange,
				eloBefore: opponentEloBefore,
				eloAfter: opponentEloAfter,
				calculationMethod: 'fixed_25',
				createdAt
			}
		})

		await prisma.user.update({
			where: {
				id: player.id
			},
			data: {
				elo: playerEloAfter
			}
		})

		await prisma.user.update({
			where: {
				id: opponent.id
			},
			data: {
				elo: opponentEloAfter
			}
		})

		playerElo = playerEloAfter
		opponentElo = opponentEloAfter

		console.log(
			`Created match ${i + 1}/10: ${match.id} | player ELO: ${playerElo}`
		)
	}

	await prisma.playerStats.upsert({
		where: {
			userId: player.id
		},
		create: {
			userId: player.id,
			totalMatches: MATCHES.length,
			totalWins: MATCHES.filter(match => match.won).length,
			totalLosses: MATCHES.filter(match => !match.won).length,
			totalKills: MATCHES.reduce((sum, match) => sum + match.kills, 0),
			totalDeaths: MATCHES.reduce((sum, match) => sum + match.deaths, 0),
			totalAssists: MATCHES.reduce(
				(sum, match) => sum + match.assists,
				0
			),
			totalHeadshots: MATCHES.reduce(
				(sum, match) => sum + match.headshots,
				0
			),
			totalMvpRounds: MATCHES.reduce(
				(sum, match) => sum + match.mvpRounds,
				0
			)
		},
		update: {
			totalMatches: {
				increment: MATCHES.length
			},
			totalWins: {
				increment: MATCHES.filter(match => match.won).length
			},
			totalLosses: {
				increment: MATCHES.filter(match => !match.won).length
			},
			totalKills: {
				increment: MATCHES.reduce((sum, match) => sum + match.kills, 0)
			},
			totalDeaths: {
				increment: MATCHES.reduce((sum, match) => sum + match.deaths, 0)
			},
			totalAssists: {
				increment: MATCHES.reduce(
					(sum, match) => sum + match.assists,
					0
				)
			},
			totalHeadshots: {
				increment: MATCHES.reduce(
					(sum, match) => sum + match.headshots,
					0
				)
			},
			totalMvpRounds: {
				increment: MATCHES.reduce(
					(sum, match) => sum + match.mvpRounds,
					0
				)
			}
		}
	})

	await prisma.playerStats.upsert({
		where: {
			userId: opponent.id
		},
		create: {
			userId: opponent.id,
			totalMatches: MATCHES.length,
			totalWins: MATCHES.filter(match => !match.won).length,
			totalLosses: MATCHES.filter(match => match.won).length
		},
		update: {
			totalMatches: {
				increment: MATCHES.length
			},
			totalWins: {
				increment: MATCHES.filter(match => !match.won).length
			},
			totalLosses: {
				increment: MATCHES.filter(match => match.won).length
			}
		}
	})

	console.log('')
	console.log('Successfully created 10 test matches.')
	console.log(`Player: ${player.nickname}`)
	console.log(`Final ELO: ${playerElo}`)
}

main()
	.catch(error => {
		console.error(error)
	})
	.finally(async () => {
		await prisma.$disconnect()
		await pool.end()
	})
