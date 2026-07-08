import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { EmailConfirmationModule } from './auth/email-confirmation/email-confirmation.module'
import { MailModule } from './auth/mail/mail.module'
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module'
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MatchmakingModule } from './matchmaking/matchmaking.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'
import { MatchModule } from './match/match.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		EmailConfirmationModule,
		MailModule,
		PasswordRecoveryModule,
		TwoFactorAuthModule,
		CloudinaryModule,
		MatchmakingModule,
		MatchModule
	]
})
export class AppModule {}
