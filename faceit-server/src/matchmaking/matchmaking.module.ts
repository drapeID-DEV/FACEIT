import { Module } from '@nestjs/common'

import { MatchModule } from '@/match/match.module'
import { UserModule } from '@/user/user.module'

import { MatchAcceptanceService } from './match-acceptance.service'
import { MatchmakingController } from './matchmaking.controller'
import { MatchmakingGateway } from './matchmaking.gateway'
import { MatchmakingService } from './matchmaking.service'

@Module({
	imports: [MatchModule, UserModule],
	controllers: [MatchmakingController],
	providers: [MatchmakingService, MatchmakingGateway, MatchAcceptanceService],
	exports: [MatchmakingService]
})
export class MatchmakingModule {}
