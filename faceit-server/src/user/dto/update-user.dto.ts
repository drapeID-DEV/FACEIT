import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString({ message: 'Nickname must be a string.' })
	@IsNotEmpty({ message: 'Nickname is required.' })
	nickname: string

	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string

	@IsBoolean({ message: 'isTwoFactorEnabled must be a boolean value.' })
	isTwoFactorEnabled: boolean
}
