import { forwardRef, Module } from '@nestjs/common'

import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module'
import { UserModule } from '@/user/user.module'
import { UserService } from '@/user/user.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
	imports: [UserModule, forwardRef(() => EmailConfirmationModule)],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {}
