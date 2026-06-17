import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { TokenType } from 'generated/prisma'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { MailService } from '../mail/mail.service'
import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-pasword.dto'

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly mailService: MailService
	) {}

	public async resetPassword(dto: ResetPasswordDto) {
		const existingUser = await this.userService.findByEmail(dto.email)

		if (!existingUser) {
			throw new NotFoundException(
				'User not found. Please check the email address you entered and try again.'
			)
		}

		const passwrodResetToken = await this.generatePasswordResetToken(
			existingUser.email
		)

		await this.mailService.sendResetPasswordEmail(
			passwrodResetToken.email,
			passwrodResetToken.token
		)

		return true
	}

	public async newPassword(dto: NewPasswordDto, token: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Token not found. Please verify that the provided token is correct or request a new one.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException(
				'The password reset token has expired. Please request a new token.'
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
			where: {
				id: existingUser.id
			},
			data: {
				password: await hash(dto.password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}

	private async generatePasswordResetToken(email: string) {
		const token = uuidv4()

		const expiresIn = new Date(new Date().getTime() + 24 * 3600 * 1000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.PASSWORD_RESET
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.PASSWORD_RESET
				}
			})
		}

		const passwrodResetToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.PASSWORD_RESET
			}
		})

		return passwrodResetToken
	}
}
