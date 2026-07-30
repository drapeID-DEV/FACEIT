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
}
