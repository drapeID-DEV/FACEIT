import { Module } from '@nestjs/common'

import { MatchModule } from '@/match/match.module'
import { StatsModule } from '@/stats/stats.module'
import { UserModule } from '@/user/user.module'

import { PlayerController } from './player.controller'
import { PlayerService } from './player.service'

@Module({
	imports: [UserModule, MatchModule, StatsModule],
	controllers: [PlayerController],
	providers: [PlayerService]
})
export class PlayerModule {}
