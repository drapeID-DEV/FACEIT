import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class NewPasswordDto {
	@IsString({ message: 'Password must be a string.' })
	@MinLength(6, { message: 'Password must contain at least 6 characters.' })
	@IsNotEmpty({ message: 'New password field cannot be empty.' })
	password: string
}
