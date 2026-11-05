import { Module } from '@nestjs/common'

import { PrismaModule } from '@/prisma/prisma.module'
import { UserModule } from '@/user/user.module'

import { NotificationController } from './notification.controller'
import { NotificationGateway } from './notification.gateway'
import { NotificationService } from './notification.service'

@Module({
	imports: [PrismaModule, UserModule],
	controllers: [NotificationController],
	providers: [NotificationService, NotificationGateway]
})
export class NotificationModule {}
