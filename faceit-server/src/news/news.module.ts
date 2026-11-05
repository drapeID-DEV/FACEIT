import { Module } from '@nestjs/common'

import { PrismaModule } from '@/prisma/prisma.module'
import { UserModule } from '@/user/user.module'

import { NewsController } from './news.controller'
import { NewsService } from './news.service'

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [NewsController],
	providers: [NewsService]
})
export class NewsModule {}
