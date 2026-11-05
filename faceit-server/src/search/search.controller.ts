import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { SearchQueryDto } from './dto/search-query.dto'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get()
	async search(@Query() query: SearchQueryDto) {
		return this.searchService.search(query)
	}
}
