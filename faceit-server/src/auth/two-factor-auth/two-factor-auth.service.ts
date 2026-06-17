import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType, User } from 'generated/prisma'

import { PrismaService } from '@/prisma/prisma.service'

import { MailService } from '../mail/mail.service'

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()

		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.TWO_FACTOR
				}
			})
		}

		const twoFactorToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorToken
	}

	public async validateTwoFactorToken(email: string, code: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Two-factor authentication token not found. Please make sure you are using a valid token.'
			)
		}

		if (existingToken.token !== code) {
			throw new BadRequestException(
				'Invalid two-factor authentication code. Please check the code you entered and try again.'
			)
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			await this.prismaService.token.delete({
				where: { id: existingToken.id, type: TokenType.VERIFICATION }
			})
			throw new BadRequestException(
				'Two-factor token has expired. Please request a new verification token.'
			)
		}

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: TokenType.TWO_FACTOR }
		})

		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorTokenToken = await this.generateTwoFactorToken(email)

		try {
			await this.mailService.sendTwoFactorTokenEmail(
				twoFactorTokenToken.email,
				twoFactorTokenToken.token
			)
		} catch (error) {
			throw new Error('Failed to send two-factor email')
		}

		return true
	}
}
