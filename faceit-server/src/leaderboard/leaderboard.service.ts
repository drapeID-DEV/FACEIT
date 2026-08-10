import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { LeaderboardQueryDto } from './dto/leaderboard-query.dto'

@Injectable()
export class LeaderboardService {
	constructor(private readonly prismaService: PrismaService) {}

	async getLeaderboard(query: LeaderboardQueryDto) {
		const { page, limit } = query

		const skip = (page - 1) * limit

		const [users, total] = await Promise.all([
			this.prismaService.user.findMany({
				orderBy: [
					{
						elo: 'desc'
					},
					{
						id: 'asc'
					}
				],
				skip,
				take: limit,
				select: {
					id: true,
					nickname: true,
					profilePic: true,
					elo: true
				}
			}),

			this.prismaService.user.count()
		])

		const players = users.map((user, index) => ({
			rank: skip + index + 1,
			...user
		}))

		return {
			players,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit)
		}
	}

	async getMyRank(userId: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			},
			select: {
				id: true,
				nickname: true,
				profilePic: true,
				elo: true
			}
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const playersAbove = await this.prismaService.user.count({
			where: {
				OR: [
					{
						elo: {
							gt: user.elo
						}
					},
					{
						elo: user.elo,
						id: {
							lt: user.id
						}
					}
				]
			}
		})

		return {
			rank: playersAbove + 1,
			...user
		}
	}
}
