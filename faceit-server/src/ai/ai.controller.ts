import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query
} from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { UserService } from '@/user/user.service'

import { AiService } from './ai.service'

@Controller('ai')
export class AiController {
	constructor(
		private readonly aiService: AiService,
		private readonly userService: UserService
	) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('player/:nickname/recommendations')
	async getPlayerRecommendations(
		@Param('nickname') nickname: string,
		@Query('regenerate') regenerate?: string
	) {
		const user = await this.userService.findByNickname(nickname)

		return this.aiService.generatePlayerRecommendations(
			user.id,
			regenerate === 'true'
		)
	}
}
