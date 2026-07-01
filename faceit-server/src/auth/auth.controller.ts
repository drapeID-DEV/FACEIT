import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { Request, Response } from 'express'

import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { GoogleAuthGuard } from './guards/google.guard'

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly authService: AuthService,
		private readonly emailConfirmationService: EmailConfirmationService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res)
	}

	@Get('google')
	@UseGuards(GoogleAuthGuard)
	public async googleAuth() {}

	@Get('google/callback')
	@UseGuards(GoogleAuthGuard)
	public async googleCallback(@Req() req: Request, @Res() res: Response) {
		return this.authService.googleLogin(req, res)
	}
}
