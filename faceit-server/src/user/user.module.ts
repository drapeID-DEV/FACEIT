import { Module } from '@nestjs/common'

import { SteamLinkService } from './steam-link.service'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
	controllers: [UserController],
	providers: [UserService, SteamLinkService],
	exports: [UserService]
})
export class UserModule {}
