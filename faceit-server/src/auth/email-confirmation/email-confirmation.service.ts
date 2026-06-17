import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { AuthService } from '@/auth/auth.service'
import { MailService } from '@/auth/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { TokenType } from '../../../generated/prisma'
import { ConfirmationDto } from './dto/email-confirmation.dto'

@Injectable()
export class EmailConfirmationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly mailService: MailService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		private readonly config: ConfigService
	) {}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()

		const expiresIn = new Date(new Date().getTime() + 24 * 3600 * 1000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.VERIFICATION
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.VERIFICATION
				}
			})
		}

		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION
			}
		})

		return verificationToken
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)

		try {
			await this.mailService.sendConfirmationEmail(
				verificationToken.email,
				verificationToken.token
			)
		} catch (error) {
			throw new Error('Failed to send verification email')
		}
	}

	public async newVerification(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Verification token not found. Please make sure you are using a valid token.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			await this.prismaService.token.delete({
				where: { id: existingToken.id, type: TokenType.VERIFICATION }
			})
			throw new BadRequestException(
				'The verification token has expired. Please request a new verification token.'
			)
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)

		if (!existingUser) {
			throw new NotFoundException(
				'No user was found with the specified email address. Please make sure you entered the correct email.'
			)
		}

		await this.prismaService.user.update({
			where: { id: existingUser.id },
			data: { isVerified: true }
		})

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.VERIFICATION }
		})

		return this.authService.saveSession(req, existingUser)
	}
}
