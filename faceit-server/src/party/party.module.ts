import { Module } from '@nestjs/common'

import { FriendshipModule } from '@/friendship/friendship.module'
import { MatchModule } from '@/match/match.module'
import { UserModule } from '@/user/user.module'

import { PartyController } from './party.controller'
import { PartyGateway } from './party.gateway'
import { PartyService } from './party.service'

@Module({
	imports: [FriendshipModule, MatchModule, UserModule],
	controllers: [PartyController],
	providers: [PartyService, PartyGateway],
	exports: [PartyService]
})
export class PartyModule {}
