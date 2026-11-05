import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

const trim = ({ value }: { value: unknown }) =>
	typeof value === 'string' ? value.trim() : value

export class NewsDto {
	@Transform(trim)
	@IsString({ message: 'Title must be a string.' })
	@IsNotEmpty({ message: 'Title is required.' })
	title: string

	@Transform(trim)
	@IsString({ message: 'Description must be a string.' })
	@IsNotEmpty({ message: 'Description is required.' })
	description: string
}
