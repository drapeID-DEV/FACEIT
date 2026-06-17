import { forwardRef, Module } from '@nestjs/common'

import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module'
import { UserModule } from '@/user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module'

@Module({
	imports: [
		UserModule,
		TwoFactorAuthModule,
		forwardRef(() => EmailConfirmationModule)
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {}
