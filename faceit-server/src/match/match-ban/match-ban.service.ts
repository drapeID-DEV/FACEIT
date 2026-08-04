import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Match } from 'generated/prisma'

import { PrismaService } from '@/prisma/prisma.service'

import { getRandomLeader } from './helpers/getRandomLeader'

@Injectable()
export class MatchBanService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService
	) {}

	private readonly banTimers = new Map<string, NodeJS.Timeout>()

	private getMapPool(): string[] {
		return this.configService
			.getOrThrow<string>('MATCH_MAP_POOL')
			.split(',')
			.map(map => map.trim())
	}

	private getRandomMap(maps: string[]) {
		return maps[Math.floor(Math.random() * maps.length)]
	}

	private async performBan(match: Match, map: string) {
		const availableMaps = match.availableMaps.filter(
			availableMap => availableMap !== map
		)

		const isBanFinished = availableMaps.length === 1

		const nextTurn = match.currentBanTurn === 'TEAM1' ? 'TEAM2' : 'TEAM1'

		const updatedMatch = await this.prismaService.match.update({
			where: {
				id: match.id
			},
			data: {
				availableMaps,
				selectedMap: isBanFinished ? availableMaps[0] : undefined,
				status: isBanFinished ? 'LIVE' : undefined,
				currentBanTurn: isBanFinished ? null : nextTurn,
				banDeadline: isBanFinished
					? null
					: new Date(Date.now() + 30_000)
			}
		})

		if (isBanFinished) {
			const timer = this.banTimers.get(match.id)

			if (timer) {
				clearTimeout(timer)
				this.banTimers.delete(match.id)
			}
		} else {
			this.scheduleAutoBan(match.id)
		}

		return updatedMatch
	}

	private scheduleAutoBan(matchId: string) {
		const existingTimer = this.banTimers.get(matchId)

		if (existingTimer) {
			clearTimeout(existingTimer)
		}

		const timer = setTimeout(async () => {
			try {
				const match = await this.prismaService.match.findUnique({
					where: {
						id: matchId
					}
				})

				if (!match) {
					this.banTimers.delete(matchId)
					return
				}

				if (match.status !== 'MAP_BAN') {
					this.banTimers.delete(matchId)
					return
				}

				if (!match.banDeadline || match.banDeadline > new Date()) {
					return
				}

				const randomMap = this.getRandomMap(match.availableMaps)

				await this.performBan(match, randomMap)
			} catch (error) {
				console.error(error)
			} finally {
				this.banTimers.delete(matchId)
			}
		}, 30_000)

		this.banTimers.set(matchId, timer)
	}

	async start(matchId: string) {
		const match = await this.prismaService.match.findUnique({
			where: {
				id: matchId
			},
			include: {
				participants: true
			}
		})

		if (!match) {
			throw new NotFoundException('Match not found')
		}

		const team1 = match.participants.filter(p => p.team === 1)
		const team2 = match.participants.filter(p => p.team === 2)

		const team1Leader = getRandomLeader(team1)
		const team2Leader = getRandomLeader(team2)

		const deadline = new Date(Date.now() + 30_000)

		const updatedMatch = await this.prismaService.match.update({
			where: {
				id: matchId
			},
			data: {
				status: 'MAP_BAN',
				availableMaps: this.getMapPool(),
				currentBanTurn: 'TEAM1',
				team1LeaderId: team1Leader.userId,
				team2LeaderId: team2Leader.userId,
				banDeadline: deadline
			}
		})

		this.scheduleAutoBan(updatedMatch.id)

		return updatedMatch
	}

	async banMap(matchId: string, userId: string, map: string) {
		const match = await this.prismaService.match.findUnique({
			where: {
				id: matchId
			}
		})

		if (!match) {
			throw new NotFoundException('Match not found')
		}

		if (match.status !== 'MAP_BAN') {
			throw new BadRequestException('Map ban stage is finished')
		}

		const currentLeader =
			match.currentBanTurn === 'TEAM1'
				? match.team1LeaderId
				: match.team2LeaderId

		if (currentLeader !== userId) {
			throw new ForbiddenException('It is not your turn')
		}

		if (!match.availableMaps.includes(map)) {
			throw new BadRequestException('Map has already been banned')
		}

		return this.performBan(match, map)
	}

	async getState(matchId: string, userId: string) {
		const match = await this.prismaService.match.findUnique({
			where: {
				id: matchId
			}
		})

		if (!match) {
			throw new NotFoundException('Match not found')
		}

		const currentLeader =
			match.currentBanTurn === 'TEAM1'
				? match.team1LeaderId
				: match.team2LeaderId

		return {
			status: match.status,
			availableMaps: match.availableMaps,
			selectedMap: match.selectedMap,
			currentBanTurn: match.currentBanTurn,
			team1LeaderId: match.team1LeaderId,
			team2LeaderId: match.team2LeaderId,
			banDeadline: match.banDeadline
		}
	}
}
