import {
	Body,
	Controller,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserRole } from 'generated/prisma'
import { memoryStorage, Multer } from 'multer'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
