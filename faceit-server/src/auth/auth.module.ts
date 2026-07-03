import { forwardRef, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module'
import { UserModule } from '@/user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OAuthService } from './oauth.service'
import { DiscordStrategy } from './strategies/discord.strategy'
import { GoogleStrategy } from './strategies/google.strategy'
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module'

@Module({
	imports: [
		UserModule,
		TwoFactorAuthModule,
		forwardRef(() => EmailConfirmationModule),
		PassportModule.register({
			session: false
		})
	],
	controllers: [AuthController],
	providers: [AuthService, OAuthService, GoogleStrategy, DiscordStrategy],
	exports: [AuthService]
})
export class AuthModule {}
