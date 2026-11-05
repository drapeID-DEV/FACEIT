import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query
} from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { UserRole } from '../../generated/prisma'
import { NewsQueryDto } from './dto/news-query.dto'
import { NewsDto } from './dto/news.dto'
import { NewsService } from './news.service'

@Controller('news')
export class NewsController {
	constructor(private readonly newsService: NewsService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get()
	async findAll(@Query() query: NewsQueryDto) {
		return this.newsService.findAll(query)
	}

	@Authorization(UserRole.ADMIN)
	@Post()
	async create(@Authorized('id') authorId: string, @Body() dto: NewsDto) {
		return this.newsService.create(authorId, dto)
	}

	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: NewsDto) {
		return this.newsService.update(id, dto)
	}

	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.newsService.delete(id)
	}
}
