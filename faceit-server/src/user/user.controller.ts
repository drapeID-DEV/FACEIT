import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	Query,
	Res,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { UserRole } from '../../generated/prisma'
import { memoryStorage } from 'multer'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { UpdateUserDto } from './dto/update-user.dto'
import { SteamLinkService } from './steam-link.service'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly steamLinkService: SteamLinkService,
		private readonly configService: ConfigService
	) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile/:nickname')
	public async findProfile(@Param('nickname') nickname: string) {
		return this.userService.findByNickname(nickname)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('me')
	public async findMe(@Authorized('id') userId: string) {
		return this.userService.findById(userId)
	}

	@Authorization(UserRole.ADMIN)
	@HttpCode(HttpStatus.OK)
	@Get('by-id/:id')
	public async findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Patch('profile')
	public async updateProfile(
		@Authorized('id') userId: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(userId, dto)
	}

	@Authorization()
	@Get('steam/link')
	public linkSteam(@Res() res: Response) {
		return res.redirect(this.steamLinkService.buildLoginUrl())
	}

	@Authorization()
	@Get('steam/callback')
	public async steamCallback(
		@Authorized('id') userId: string,
		@Query() query: Record<string, unknown>,
		@Res() res: Response
	) {
		const steamId = await this.steamLinkService.verify(query)

		const result = steamId
			? await this.userService.linkSteam(userId, steamId)
			: 'failed'

		const clientUrl = this.configService
			.getOrThrow<string>('CLIENT_URL')
			.replace(/\/$/, '')

		return res.redirect(`${clientUrl}/settings/account?steam=${result}`)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Delete('steam')
	public unlinkSteam(@Authorized('id') userId: string) {
		return this.userService.unlinkSteam(userId)
	}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Post('profile-picture')
	@UseInterceptors(
		FileInterceptor('avatar', {
			storage: memoryStorage(),
			limits: {
				fileSize: 5 * 1024 * 1024
			}
		})
	)
	uploadAvatar(
		@Authorized('id') userId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType: /(jpg|jpeg|png|webp)$/
					})
				]
			})
		)
		file: Express.Multer.File
	) {
		return this.userService.uploadAvatar(userId, file)
	}
}
