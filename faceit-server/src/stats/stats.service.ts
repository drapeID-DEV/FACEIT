import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class StatsService {
	constructor(private readonly prisma: PrismaService) {}

	public async findByUserId(userId: string) {
		const stats = await this.prisma.playerStats.findUnique({
			where: {
				userId
			}
		})

		if (!stats) {
			throw new NotFoundException('Player statistics not found.')
		}

		return stats
	}
}
