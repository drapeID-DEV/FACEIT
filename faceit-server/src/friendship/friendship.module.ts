import { Module } from '@nestjs/common'

import { UserModule } from '@/user/user.module'

import { FriendshipController } from './friendship.controller'
import { FriendshipService } from './friendship.service'

@Module({
	imports: [UserModule],
	controllers: [FriendshipController],
	providers: [FriendshipService],
	exports: [FriendshipService]
})
export class FriendshipModule {}
