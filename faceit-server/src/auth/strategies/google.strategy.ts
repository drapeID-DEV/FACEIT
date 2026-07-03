import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'

import { IOAuthUser } from '../interfaces/oauth-user.interface'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(config: ConfigService) {
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
		profile: Profile
	): Promise<IOAuthUser> {
		return {
			provider: 'google',
			providerId: profile.id,
			email: profile.emails?.[0]?.value ?? '',
			name: profile.displayName,
			picture: profile.photos?.[0]?.value,
			accessToken,
			refreshToken
		}
	}
}
