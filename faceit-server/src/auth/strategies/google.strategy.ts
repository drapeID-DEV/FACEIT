import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

import { IOAuthUser } from '../interfaces/oauth-user.interface'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(config: ConfigService) {
		console.log(config.getOrThrow('GOOGLE_CALLBACK_URL'))
		super({
			clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
			callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),

			scope: ['email', 'profile']
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	) {
		const user: IOAuthUser = {
			provider: 'google',
			providerId: profile.id,
			email: profile.emails?.[0].value ?? '',
			displayName: profile.displayName,
			picture: profile.photos?.[0].value,
			accessToken,
			refreshToken
		}

		done(null, user)
	}
}
