import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { Prisma } from '../../generated/prisma'
import { SearchQueryDto } from './dto/search-query.dto'

@Injectable()
export class SearchService {
	constructor(private readonly prismaService: PrismaService) {}

	async search({ q, limit }: SearchQueryDto) {
		// `contains` compiles to LIKE, so nicknames like demo_1 need the wildcards escaped
		const contains: Prisma.StringFilter = {
			contains: q.replace(/[\\%_]/g, '\\$&'),
			mode: 'insensitive'
		}

		const playersWhere: Prisma.UserWhereInput = { nickname: contains }
		const newsWhere: Prisma.NewsWhereInput = {
			OR: [{ title: contains }, { description: contains }]
		}

		const [players, playersTotal, news, newsTotal] = await Promise.all([
			this.prismaService.user.findMany({
				where: playersWhere,
				orderBy: [{ elo: 'desc' }, { id: 'asc' }],
				take: limit,
				select: {
					id: true,
					nickname: true,
					profilePic: true,
					elo: true
				}
			}),
			this.prismaService.user.count({ where: playersWhere }),
			this.prismaService.news.findMany({
				where: newsWhere,
				orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
				take: limit,
				select: {
					id: true,
					title: true,
					description: true,
					createdAt: true,
					updatedAt: true
				}
			}),
			this.prismaService.news.count({ where: newsWhere })
		])

		return { players, playersTotal, news, newsTotal }
	}
}
