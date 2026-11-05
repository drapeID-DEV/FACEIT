import { IsBoolean } from 'class-validator'

export class UpdateUserBanDto {
	@IsBoolean({ message: 'isBanned must be a boolean value.' })
	isBanned: boolean
}
