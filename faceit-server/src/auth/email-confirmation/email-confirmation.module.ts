import { forwardRef, Module } from '@nestjs/common'

import { AuthModule } from '@/auth/auth.module'
import { MailModule } from '@/auth/mail/mail.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UserModule } from '@/user/user.module'

import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
	imports: [
		PrismaModule,
		UserModule,
		MailModule,
		forwardRef(() => AuthModule)
	],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService],
	exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
