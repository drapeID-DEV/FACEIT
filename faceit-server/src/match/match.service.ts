import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { MatchStatus, MatchType } from 'generated/prisma'

import { EloService } from '@/elo/elo.service'
import { PrismaService } from '@/prisma/prisma.service'
import { UserService } from '@/user/user.service'

import { matchWithParticipantsInclude } from './constants/match.constants'
import { FinishMatchDto } from './dto/finish-match.dto'

@Injectable()
export class MatchService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly eloService: EloService
	) {}

	public async create(playerIds: string[]) {
		const players = await this.prisma.user.findMany({
			where: {
				id: {
					in: playerIds
				}
			}
		})

		if (players.length !== playerIds.length) {
			throw new NotFoundException('One or more players were not found.')
		}

		return this.prisma.$transaction(async tx => {
			return tx.match.create({
				data: {
					matchType: MatchType.ONE_VS_ONE,
					maxPlayersPerTeam: 1,
					status: MatchStatus.READY,

					participants: {
						create: players.map((player, index) => ({
							userId: player.id,
							team: index < players.length / 2 ? 1 : 2,
							isWinner: false,
							eloBefore: player.elo,
							eloAfter: player.elo
						}))
					}
				},
				include: matchWithParticipantsInclude
			})
		})
	}

	public async findById(matchId: string) {
		const match = await this.prisma.match.findUnique({
			where: { id: matchId },
			include: matchWithParticipantsInclude
		})

		if (!match) {
			throw new NotFoundException('Match not found')
		}

		return match
	}

	public async startMatch(matchId: string) {
		const match = await this.prisma.match.findUnique({
			where: { id: matchId }
		})

		if (!match) {
			throw new NotFoundException('Match not found')
		}

		if (match.status !== MatchStatus.READY) {
			throw new BadRequestException('Match is not in READY state')
		}

		await this.prisma.match.update({
			where: { id: matchId },
			data: {
				status: MatchStatus.LIVE
			}
		})

		return this.findById(matchId)
	}

	public async finishMatch(matchId: string, data: FinishMatchDto) {
		return this.prisma.$transaction(async tx => {
			const match = await tx.match.findUnique({
				where: { id: matchId },
				include: { participants: true }
			})

			if (!match) {
				throw new NotFoundException('Match not found')
			}

			if (match.status !== MatchStatus.LIVE) {
				throw new BadRequestException('Match is not live')
			}

			await tx.match.update({
				where: { id: matchId },
				data: {
					status: MatchStatus.FINISHED,
					finishedAt: new Date(),
					winnerTeam: data.winnerTeam,
					team1Score: data.team1Score,
					team2Score: data.team2Score
				}
			})

			for (const participant of match.participants) {
				const isWinner = participant.team === data.winnerTeam
				const eloChange = isWinner ? 25 : -25
				const eloAfter = participant.eloBefore + eloChange

				const playerStats = data.playerStats.find(
					s => s.userId === participant.userId
				)

				if (!playerStats) {
					throw new BadRequestException(
						`Stats missing for player ${participant.userId}`
					)
				}

				await tx.matchParticipant.update({
					where: { id: participant.id },
					data: {
						isWinner,
						eloAfter,
						kills: playerStats.kills,
						deaths: playerStats.deaths,
						assists: playerStats.assists,
						headshots: playerStats.headshots,
						mvpRounds: playerStats.mvpRounds
					}
				})

				await tx.user.update({
					where: { id: participant.userId },
					data: {
						elo: eloAfter
					}
				})

				await this.eloService.createEloHistoryWithCleanup({
					userId: participant.userId,
					matchId: match.id,
					eloChange,
					eloBefore: participant.eloBefore,
					eloAfter,
					calculationMethod: 'fixed_25'
				})

				await tx.playerStats.upsert({
					where: { userId: participant.userId },
					create: {
						userId: participant.userId,
						totalMatches: 1,
						totalWins: isWinner ? 1 : 0,
						totalLosses: isWinner ? 0 : 1,
						totalKills: playerStats.kills,
						totalDeaths: playerStats.deaths,
						totalAssists: playerStats.assists,
						totalHeadshots: playerStats.headshots,
						totalMvpRounds: playerStats.mvpRounds
					},
					update: {
						totalMatches: { increment: 1 },
						totalWins: { increment: isWinner ? 1 : 0 },
						totalLosses: { increment: isWinner ? 0 : 1 },
						totalKills: { increment: playerStats.kills },
						totalDeaths: { increment: playerStats.deaths },
						totalAssists: { increment: playerStats.assists },
						totalHeadshots: { increment: playerStats.headshots },
						totalMvpRounds: { increment: playerStats.mvpRounds }
					}
				})
			}

			return this.findById(matchId)
		})
	}

	public async cancelMatch(matchId: string, reason?: string) {
		const match = await this.prisma.match.findUnique({
			where: { id: matchId }
		})

		if (!match) {
			throw new NotFoundException('Match not found')
		}

		await this.prisma.match.update({
			where: { id: matchId },
			data: {
				status: MatchStatus.CANCELLED,
				cancellationReason: reason || 'Match cancelled'
			}
		})

		return this.findById(matchId)
	}

	public async findActiveMatchByUserId(userId: string) {
		return this.prisma.match.findFirst({
			where: {
				status: {
					in: [MatchStatus.READY, MatchStatus.LIVE]
				},
				participants: {
					some: {
						userId
					}
				}
			},
			include: matchWithParticipantsInclude
		})
	}
}
