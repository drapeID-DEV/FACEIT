import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { verify } from 'argon2'
import { Request, Response } from 'express'

import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service'
import { UserService } from '@/user/user.service'

import { AuthMethod } from '../../generated/prisma'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

@Injectable()
export class AuthService {
	public constructor(
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly twoFactorAuthService: TwoFactorAuthService,
		@Inject(forwardRef(() => EmailConfirmationService))
		private readonly emailConfirmationService: EmailConfirmationService
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException(
				'Registration failed. A user with this email already exists. Please use a different email address or log in to the system.'
			)
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMethod.CREADENTIALS,
			false
		)

		await this.emailConfirmationService.sendVerificationToken(newUser.email)

		return {
			message:
				'Registration successful. Please check your email to verify your account.'
		}
	}

	public async login(req: Request, dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email)

		if (!user || !user.password) {
			throw new NotFoundException(
				'User not found. Please check the provided credentials.'
			)
		}

		if (!user.isVerified) {
			throw new UnauthorizedException(
				'Email not verified. Please verify your email address before logging in.'
			)
		}

		const isValidPassword = await verify(user.password, dto.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Incorrect password. Please try again or reset your password if you have forgotten it.'
			)
		}

		if (!user.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(
				user.email
			)
			throw new UnauthorizedException(
				'Your email address has not been verified. Please check your inbox and verify your email address.'
			)
		}

		if (user.isTwoFactorEnabled) {
			if (!dto.code) {
				await this.twoFactorAuthService.sendTwoFactorToken(user.email)

				return {
					message:
						'Please check your email. A two-factor authentication code is required.'
				}
			}

			await this.twoFactorAuthService.validateTwoFactorToken(
				user.email,
				dto.code
			)
		}

		return this.saveSession(req, user)
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Failed to end the session. There may have been a server issue, or the session has already been terminated.'
						)
					)
				}
				res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve()
			})
		})
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id

			req.session.save(err => {
				if (err) {
					console.error('Session save error:', err)
					return reject(
						new InternalServerErrorException(
							'Failed to save the session. Please check that the session settings are configured correctly.'
						)
					)
				}

				resolve({ user })
			})
		})
	}
}
