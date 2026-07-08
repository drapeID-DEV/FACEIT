import { Module } from '@nestjs/common'

import { EloModule } from '@/elo/elo.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UserModule } from '@/user/user.module'

import { MatchController } from './match.controller'
import { MatchService } from './match.service'

@Module({
	imports: [PrismaModule, UserModule, EloModule],
	controllers: [MatchController],
	providers: [MatchService],
	exports: [MatchService]
})
export class MatchModule {}
