import { Module } from '@nestjs/common'

import { PrismaModule } from '@/prisma/prisma.module'

import { GameServerController } from './game-server.controller'
import { GameServerService } from './game-server.service'
import { LiveMatchService } from './live-match.service'

@Module({
	imports: [PrismaModule],
	controllers: [GameServerController],
	providers: [GameServerService, LiveMatchService],
	exports: [GameServerService, LiveMatchService]
})
export class GameServerModule {}
