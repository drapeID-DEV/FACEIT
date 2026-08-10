import { Module } from '@nestjs/common'

import { PrismaModule } from '@/prisma/prisma.module'
import { UserModule } from '@/user/user.module'

import { LeaderboardController } from './leaderboard.controller'
import { LeaderboardService } from './leaderboard.service'

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [LeaderboardController],
	providers: [LeaderboardService]
})
export class LeaderboardModule {}
