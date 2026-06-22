import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod } from '@prisma/client'
import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'

import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

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

	public async create(
		email: string,
		password: string,
		nickname: string,
		profilePic: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		const user = this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				nickname,
				profilePic,
				method,
				isVerified
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async update(userId: string, dto: UpdateUserDto) {
		const user = await this.findById(userId)

		const updatedUser = await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				nickname: dto.nickname,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		})

		return updatedUser
	}
}
