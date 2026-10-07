import { Module } from '@nestjs/common'

import { StatsModule } from '@/stats/stats.module'
import { UserModule } from '@/user/user.module'

import { AiController } from './ai.controller'
import { AiService } from './ai.service'

@Module({
	imports: [StatsModule, UserModule],
	controllers: [AiController],
	providers: [AiService]
})
export class AiModule {}
