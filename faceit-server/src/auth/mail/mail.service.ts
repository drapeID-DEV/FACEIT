// src/libs/mail/mail.service.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

import ConfirmationTemplate from './templates/confirmation.template'
import ResetPasswordTemplate from './templates/reset-password.template'
import TwoFactorAuthTemplate from './templates/two-factor.template'

@Injectable()
export class MailService {
	private readonly resend: Resend

	constructor(private readonly configService: ConfigService) {
		this.resend = new Resend(
			this.configService.getOrThrow('RESEND_API_KEY')
		)
	}

	public async sendConfirmationEmail(email: string, token: string) {
		await this.resend.emails.send({
			from: 'Faceit <onboarding@resend.dev>',
			to: email,
			subject: 'Verify your email address',
			react: ConfirmationTemplate({
				domain: this.configService.getOrThrow('ALLOWED_ORIGIN'),
				token
			})
		})
	}

	public async sendResetPasswordEmail(email: string, token: string) {
		await this.resend.emails.send({
			from: 'Faceit <onboarding@resend.dev>',
			to: email,
			subject: 'Reset your password',
			react: ResetPasswordTemplate({
				domain: this.configService.getOrThrow('ALLOWED_ORIGIN'),
				token
			})
		})
	}

	public async sendTwoFactorTokenEmail(email: string, token: string) {
		await this.resend.emails.send({
			from: 'Faceit <onboarding@resend.dev>',
			to: email,
			subject: 'Two-Factor Authentication',
			react: TwoFactorAuthTemplate({
				token
			})
		})
	}
}
