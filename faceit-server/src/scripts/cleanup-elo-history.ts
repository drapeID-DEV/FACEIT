import { PrismaClient } from '../../generated/prisma'

async function cleanupAllEloHistory() {
	const prisma = new PrismaClient()
	const retentionLimit = parseInt(
		process.env.ELO_HISTORY_RETENTION_LIMIT || '20'
	)

	try {
		console.log(
			`Starting ELO history cleanup (retention limit: ${retentionLimit})`
		)

		// Get all unique user IDs that have ELO history
		const usersWithHistory = await prisma.eloHistory.findMany({
			select: { userId: true },
			distinct: ['userId']
		})

		console.log(`Found ${usersWithHistory.length} users with ELO history`)

		let totalDeleted = 0

		for (const { userId } of usersWithHistory) {
			// Get all records for this user
			const allRecords = await prisma.eloHistory.findMany({
				where: { userId },
				orderBy: { createdAt: 'desc' },
				select: { id: true }
			})

			// Delete records beyond the retention limit
			if (allRecords.length > retentionLimit) {
				const recordsToDelete = allRecords.slice(retentionLimit)
				const idsToDelete = recordsToDelete.map(r => r.id)

				await prisma.eloHistory.deleteMany({
					where: {
						id: { in: idsToDelete }
					}
				})

				totalDeleted += idsToDelete.length
				console.log(
					`Cleaned up ${idsToDelete.length} records for user ${userId}`
				)
			}
		}

		console.log(`Cleanup complete. Deleted ${totalDeleted} total records.`)
	} catch (error) {
		console.error('Error during cleanup:', error)
	} finally {
		await prisma.$disconnect()
	}
}

cleanupAllEloHistory()
