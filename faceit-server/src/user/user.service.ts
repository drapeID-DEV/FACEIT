import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { hash } from 'argon2'

import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { PrismaService } from '@/prisma/prisma.service'

import { AuthMethod, User, UserRole } from '../../generated/prisma'
import { UpdateUserDto } from './dto/update-user.dto'

// These results reach API responses, so the password hash must stay out
const safeUserOmit = {
	password: true
}

@Injectable()
export class UserService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly eventEmitter: EventEmitter2
	) {}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			omit: safeUserOmit
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
				id: true,
				nickname: true,
				profilePic: true,
				elo: true,
				role: true,
				isBanned: true,
				createdAt: true,
				updatedAt: true,
				playerStats: true
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
		return this.prismaService.$transaction(async tx => {
			const user = await tx.user.create({
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

			// Auto-create PlayerStats with all zeros
			await tx.playerStats.create({
				data: {
					userId: user.id,
					totalMatches: 0,
					totalWins: 0,
					totalLosses: 0,
					totalKills: 0,
					totalDeaths: 0,
					totalAssists: 0,
					totalHeadshots: 0,
					totalMvpRounds: 0
				}
			})

			return user
		})
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
			},
			omit: safeUserOmit
		})
	}

	public async updateRole(adminId: string, userId: string, role: UserRole) {
		if (adminId === userId) {
			throw new BadRequestException('You cannot change your own role.')
		}

		const user = await this.findById(userId)

		if (user.isBanned && role === UserRole.ADMIN) {
			throw new BadRequestException(
				'Unban this user before promoting them.'
			)
		}

		return this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				role
			},
			omit: safeUserOmit
		})
	}

	public async updateBan(
		adminId: string,
		userId: string,
		isBanned: boolean
	) {
		if (adminId === userId) {
			throw new BadRequestException('You cannot ban yourself.')
		}

		const user = await this.findById(userId)

		if (isBanned && user.role === UserRole.ADMIN) {
			throw new BadRequestException(
				'Remove admin rights before banning this user.'
			)
		}

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				isBanned
			},
			omit: safeUserOmit
		})

		if (isBanned) {
			this.eventEmitter.emit('user.banned', { userId })
		}

		return updatedUser
	}

	// steamId must come from SteamLinkService.verify, never from user input
	public async linkSteam(
		userId: string,
		steamId: string
	): Promise<'linked' | 'taken'> {
		const steamOwner = await this.prismaService.user.findFirst({
			where: { steamId, NOT: { id: userId } }
		})

		if (steamOwner) {
			return 'taken'
		}

		await this.prismaService.user.update({
			where: { id: userId },
			data: { steamId }
		})

		return 'linked'
	}

	public async unlinkSteam(userId: string) {
		return this.prismaService.user.update({
			where: { id: userId },
			data: { steamId: null },
			omit: safeUserOmit
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
			},
			omit: safeUserOmit
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

	public async generateNickname(email: string) {
		const base = email
			.split('@')[0]
			.replace(/[^a-zA-Z0-9]/g, '')
			.toLowerCase()

		let nickname = base
		let index = 1

		while (
			await this.prismaService.user.findUnique({
				where: { nickname }
			})
		) {
			const suffix = index.toString()

			nickname = base.slice(0, 15 - suffix.length) + suffix

			index++
		}

		return nickname
	}
}
