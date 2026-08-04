import { Module } from '@nestjs/common'

import { EloModule } from '@/elo/elo.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UserModule } from '@/user/user.module'

import { MatchBanService } from './match-ban/match-ban.service'
import { MatchController } from './match.controller'
import { MatchGateway } from './match.gateway'
import { MatchService } from './match.service'

@Module({
	imports: [PrismaModule, UserModule, EloModule],
	controllers: [MatchController],
	providers: [MatchService, MatchGateway, MatchBanService],
	exports: [MatchService, MatchBanService]
})
export class MatchModule {}
