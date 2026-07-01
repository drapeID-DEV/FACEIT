import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { AuthMethod } from '@prisma/client'
import { hash } from 'argon2'
import { transliterate } from 'transliteration'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { PrismaService } from '@/prisma/prisma.service'

import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user) {
			throw new NotFoundException(
				'User not found. Please check the data.'
			)
		}

		return user
	}

	public async findByNickname(nickname: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				nickname
			},
			select: {
				nickname: true,
				profilePic: true,
				createdAt: true
			}
		})

		if (!user) {
			throw new NotFoundException(
				'User not found. Please check the data.'
			)
		}

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async create(dto: {
		email: string
		password?: string | null
		nickname: string
		profilePic?: string | null
		method: AuthMethod
		isVerified: boolean
	}) {
		const user = this.prismaService.user.create({
			data: {
				email: dto.email,
				password: dto.password ? await hash(dto.password) : null,
				nickname: dto.nickname,
				profilePic: dto.profilePic,
				method: dto.method,
				isVerified: dto.isVerified
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async update(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		const existingUser = await this.prismaService.user.findFirst({
			where: {
				OR: [{ email: dto.email }, { nickname: dto.nickname }],
				NOT: {
					id: user.id
				}
			}
		})

		if (existingUser) {
			if (existingUser.email === dto.email) {
				throw new BadRequestException('This email is already in use.')
			}

			if (existingUser.nickname === dto.nickname) {
				throw new BadRequestException(
					'This nickname is already in use.'
				)
			}
		}

		return this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				nickname: dto.nickname,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		})
	}

	public async uploadAvatar(userId: string, file: Express.Multer.File) {
		const user = await this.findById(userId)

		if (!user) {
			throw new NotFoundException('User not found. Please try later!')
		}

		if (user.profilePictureId) {
			await this.cloudinaryService.delete(user.profilePictureId)
		}

		const image = await this.cloudinaryService.upload(file)

		if (!image) {
			throw new BadRequestException(
				'Something went wrong. Canno`t upload avatar.'
			)
		}

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				profilePic: image.secure_url,
				profilePictureId: image.public_id
			}
		})

		return updatedUser
	}

	public async findAccount(provider: string, providerAccountId: string) {
		return this.prismaService.account.findUnique({
			where: {
				provider_providerAccountId: {
					provider,
					providerAccountId
				}
			},
			include: {
				user: true
			}
		})
	}

	public async createAccount(
		userId: string,
		provider: string,
		providerAccountId: string,
		accessToken?: string,
		refreshToken?: string | undefined,
		expiresAt?: number
	) {
		return this.prismaService.account.create({
			data: {
				userId,
				type: 'oauth',
				provider,
				providerAccountId,
				accessToken,
				refreshToken,
				expiresAt
			}
		})
	}

	public async generateNickname(displayName: string) {
		const base = transliterate(displayName)
			.replace(/\s+/g, '')
			.toLowerCase()
			.slice(0, 20)

		let nickname = base
		let index = 1

		while (
			await this.prismaService.user.findUnique({
				where: { nickname }
			})
		) {
			const suffix = index.toString()

			nickname = base.slice(0, 20 - suffix.length) + suffix

			index++
		}

		return nickname
	}
}
