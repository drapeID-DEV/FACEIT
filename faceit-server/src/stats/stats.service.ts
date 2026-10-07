import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class StatsService {
	constructor(private readonly prisma: PrismaService) {}

	async getEloHistory(userId: string) {
		const matches = await this.prisma.matchParticipant.findMany({
			where: {
				userId,
				match: {
					status: 'FINISHED'
				}
			},
			select: {
				matchId: true,
				team: true,
				isWinner: true,
				eloBefore: true,
				eloAfter: true,
				kills: true,
				deaths: true,
				assists: true,
				createdAt: true,
				match: {
					select: {
						id: true,
						matchType: true,
						status: true,
						team1Score: true,
						team2Score: true,
						finishedAt: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			},
			take: 20
		})

		return matches
	}

	async getPlayerStatistics(userId: string) {
		const stats = await this.prisma.playerStats.findUnique({
			where: { userId }
		})

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: {
				elo: true
			}
		})

		if (!stats || !user) {
			return null
		}

		const winRate =
			stats.totalMatches > 0
				? (stats.totalWins / stats.totalMatches) * 100
				: 0

		const kd =
			stats.totalDeaths > 0
				? stats.totalKills / stats.totalDeaths
				: stats.totalKills

		const headshotRate =
			stats.totalKills > 0
				? (stats.totalHeadshots / stats.totalKills) * 100
				: 0

		const averageKills =
			stats.totalMatches > 0 ? stats.totalKills / stats.totalMatches : 0

		const averageDeaths =
			stats.totalMatches > 0 ? stats.totalDeaths / stats.totalMatches : 0

		const averageAssists =
			stats.totalMatches > 0 ? stats.totalAssists / stats.totalMatches : 0

		const sampleSizeCategory =
			stats.totalMatches === 0
				? 'none'
				: stats.totalMatches < 5
					? 'very_small'
					: stats.totalMatches < 10
						? 'small'
						: stats.totalMatches < 20
							? 'medium'
							: 'large'

		const hasEnoughData = stats.totalMatches >= 10

		return {
			elo: user.elo,

			matches: stats.totalMatches,
			wins: stats.totalWins,
			losses: stats.totalLosses,

			winRate,
			kd,
			headshotRate,

			averageKills,
			averageDeaths,
			averageAssists,

			totalKills: stats.totalKills,
			totalDeaths: stats.totalDeaths,
			totalAssists: stats.totalAssists,
			totalHeadshots: stats.totalHeadshots,
			totalMvpRounds: stats.totalMvpRounds,

			sampleSizeCategory,
			hasEnoughData
		}
	}
}
