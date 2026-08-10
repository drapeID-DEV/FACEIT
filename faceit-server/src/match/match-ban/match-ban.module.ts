import { Module } from '@nestjs/common'

import { UserModule } from '@/user/user.module'

import { MatchBanController } from './match-ban.controller'
import { MatchBanService } from './match-ban.service'

@Module({
	imports: [UserModule],
	controllers: [MatchBanController],
	providers: [MatchBanService]
})
export class MatchBanModule {}
