import { Module } from '@nestjs/common'

import { UserService } from '@/user/user.service'

import { MailService } from '../mail/mail.service'
import { PasswordRecoveryController } from './password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery.service'

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, UserService, MailService]
})
export class PasswordRecoveryModule {}
