import { Module } from '@nestjs/common'

import { PrismaModule } from '@/prisma/prisma.module'

import { EloService } from './elo.service'

@Module({
	imports: [PrismaModule],
	providers: [EloService],
	exports: [EloService]
})
export class EloModule {}
