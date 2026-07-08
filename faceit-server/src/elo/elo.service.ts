import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PrismaService } from '@/prisma/prisma.service'

import { Prisma } from '../../generated/prisma'

@Injectable()
export class EloService {
	private readonly retentionLimit: number

	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService
	) {
		this.retentionLimit = Number(
			this.config.get('ELO_HISTORY_RETENTION_LIMIT', 20)
		)
	}

	/**
	 * Cleans up old ELO history records for a user, keeping only the most recent N records.
	 * This should be called after creating a new ELO history entry.
	 */
	private async cleanupOldEloHistory(
		tx: Prisma.TransactionClient,
		userId: string
	): Promise<void> {
		const recordsToDelete = await tx.eloHistory.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			skip: this.retentionLimit,
			select: {
				id: true
			}
		})

		if (!recordsToDelete.length) {
			return
		}

		await tx.eloHistory.deleteMany({
			where: {
				id: {
					in: recordsToDelete.map(record => record.id)
				}
			}
		})
	}

	/**
	 * Creates an ELO history record and automatically cleans up old records.
	 */
	public async createEloHistoryWithCleanup(data: {
		userId: string
		matchId: string
		eloChange: number
		eloBefore: number
		eloAfter: number
		calculationMethod?: string
	}): Promise<void> {
		await this.prisma.$transaction(async tx => {
			await tx.eloHistory.create({
				data: {
					userId: data.userId,
					matchId: data.matchId,
					eloChange: data.eloChange,
					eloBefore: data.eloBefore,
					eloAfter: data.eloAfter,
					calculationMethod: data.calculationMethod ?? 'fixed_25'
				}
			})

			await this.cleanupOldEloHistory(tx, data.userId)
		})
	}
}
