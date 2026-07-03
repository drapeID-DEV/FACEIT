import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-discord'

import { IOAuthUser } from '../interfaces/oauth-user.interface'

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
	constructor(config: ConfigService) {
		super({
			clientID: config.getOrThrow('DISCORD_CLIENT_ID'),
			clientSecret: config.getOrThrow('DISCORD_CLIENT_SECRET'),
			callbackURL: config.getOrThrow('DISCORD_CALLBACK_URL'),
			scope: ['identify', 'email']
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile
	): Promise<IOAuthUser> {
		const picture = profile.avatar
			? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
			: undefined

		return {
			provider: 'discord',
			providerId: profile.id,
			email: profile.email ?? '',
			name: profile.username,
			picture,
			accessToken,
			refreshToken
		}
	}
}
