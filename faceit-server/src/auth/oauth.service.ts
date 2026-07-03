import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'

import { UserService } from '@/user/user.service'

import { AuthMethod } from '../../generated/prisma'
import { AuthService } from './auth.service'
import { IOAuthUser } from './interfaces/oauth-user.interface'

@Injectable()
export class OAuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	private getAuthMethod(provider: IOAuthUser['provider']): AuthMethod {
		switch (provider) {
			case 'google':
				return AuthMethod.GOOGLE

			case 'discord':
				return AuthMethod.DISCORD

			default:
				throw new BadRequestException(
					`Unsupported OAuth provider: ${provider}`
				)
		}
	}

	public async handleOAuthLogin(req: Request, res: Response) {
		const oauthUser = req.user as IOAuthUser

		if (!oauthUser.email) {
			throw new BadRequestException(
				'Unable to retrieve your email address from the OAuth provider.'
			)
		}

		const account = await this.userService.findAccount(
			oauthUser.provider,
			oauthUser.providerId
		)

		if (account) {
			await this.authService.saveSession(req, account.user)

			return res.redirect(
				this.configService.getOrThrow<string>('CLIENT_URL')
			)
		}

		let user = await this.userService.findByEmail(oauthUser.email)

		if (!user) {
			const nicknameSource =
				oauthUser.provider === 'google'
					? oauthUser.email
					: oauthUser.name

			const nickname =
				await this.userService.generateNickname(nicknameSource)

			user = await this.userService.create({
				email: oauthUser.email,
				nickname,
				password: null,
				profilePic: oauthUser.picture ?? null,
				method: this.getAuthMethod(oauthUser.provider),
				isVerified: true
			})
		}

		await this.userService.createAccount(
			user.id,
			oauthUser.provider,
			oauthUser.providerId,
			oauthUser.accessToken,
			oauthUser.refreshToken,
			0
		)

		await this.authService.saveSession(req, user)

		return res.redirect(this.configService.getOrThrow<string>('CLIENT_URL'))
	}
}
