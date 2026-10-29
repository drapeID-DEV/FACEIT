import { Module } from '@nestjs/common'

import { UserModule } from '@/user/user.module'

import { MatchModule } from '../match.module'
import { MatchBanController } from './match-ban.controller'

@Module({
	imports: [MatchModule, UserModule],
	controllers: [MatchBanController]
})
export class MatchBanModule {}
