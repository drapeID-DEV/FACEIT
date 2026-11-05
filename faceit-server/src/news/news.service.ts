import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/prisma/prisma.service'

import { NewsQueryDto } from './dto/news-query.dto'
import { NewsDto } from './dto/news.dto'

const newsSelect = {
	id: true,
	title: true,
	description: true,
	createdAt: true,
	updatedAt: true
}

@Injectable()
export class NewsService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(query: NewsQueryDto) {
		const { page, limit } = query

		const [news, total] = await Promise.all([
			this.prismaService.news.findMany({
				orderBy: [
					{
						createdAt: 'desc'
					},
					{
						id: 'asc'
					}
				],
				skip: (page - 1) * limit,
				take: limit,
				select: newsSelect
			}),

			this.prismaService.news.count()
		])

		return {
			news,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit)
		}
	}

	async create(authorId: string, dto: NewsDto) {
		return this.prismaService.news.create({
			data: {
				title: dto.title,
				description: dto.description,
				authorId
			},
			select: newsSelect
		})
	}

	async update(id: string, dto: NewsDto) {
		await this.findExisting(id)

		return this.prismaService.news.update({
			where: {
				id
			},
			data: {
				title: dto.title,
				description: dto.description
			},
			select: newsSelect
		})
	}

	async delete(id: string) {
		await this.findExisting(id)

		await this.prismaService.news.delete({
			where: {
				id
			}
		})
	}

	private async findExisting(id: string) {
		const news = await this.prismaService.news.findUnique({
			where: {
				id
			}
		})

		if (!news) {
			throw new NotFoundException('News not found')
		}

		return news
	}
}
