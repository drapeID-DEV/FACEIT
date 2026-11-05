import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'argon2'
import 'dotenv/config'
import { Pool } from 'pg'

import { AuthMethod, FriendshipStatus, PrismaClient } from '../../generated/prisma'

// Dev only: accounts for showing parties and team matches without real players.
// Run with: npx ts-node src/scripts/seed-demo-users.ts
// Remove them, and any match they played, by adding --remove
const DEMO_PASSWORD = 'demo-password-1'
const DEMO_PLAYERS = 10

const prisma = new PrismaClient({
	adapter: new PrismaPg(
		new Pool({ connectionString: process.env.POSTGRES_URI })
	)
})

async function upsertUser(nickname: string, steamId: string | null, elo: number) {
	const password = await hash(DEMO_PASSWORD)

	return prisma.user.upsert({
		where: { nickname },
		update: { steamId, isBanned: false },
		create: {
			email: `${nickname}@demo.local`,
			password,
			nickname,
			steamId,
			elo,
			method: AuthMethod.CREDENTIALS,
			isVerified: true,
			playerStats: { create: {} }
		}
	})
}

async function befriend(userId: string, targetUserId: string) {
	const [user1Id, user2Id] = [userId, targetUserId].sort()

	await prisma.friendship.upsert({
		where: { user1Id_user2Id: { user1Id, user2Id } },
		update: { status: FriendshipStatus.ACCEPTED },
		create: {
			user1Id,
			user2Id,
			requesterId: userId,
			status: FriendshipStatus.ACCEPTED
		}
	})
}

async function seed() {
	const players = []

	for (let index = 1; index <= DEMO_PLAYERS; index++) {
		players.push(
			await upsertUser(
				`demo_${index}`,
				// Placeholder, these accounts never join a real CS2 server
				`7656119900000${String(index).padStart(4, '0')}`,
				950 + index * 10
			)
		)
	}

	// Friends with everyone, but cannot queue without Steam
	const noSteam = await upsertUser('demo_nosteam', null, 1000)
	// Nobody's friend, invites to and from this account must be rejected
	await upsertUser('demo_stranger', '76561199000009999', 1000)

	const friends = [...players, noSteam]

	for (let i = 0; i < friends.length; i++) {
		for (let j = i + 1; j < friends.length; j++) {
			await befriend(friends[i].id, friends[j].id)
		}
	}

	console.log(
		`Seeded demo_1..demo_${DEMO_PLAYERS}, demo_nosteam and demo_stranger. ` +
			'Log in with <nickname>@demo.local and the password in this script.'
	)
}

// Friendships go with the users, the rest of their rows has no cascade
async function remove() {
	const users = await prisma.user.findMany({
		where: { email: { endsWith: '@demo.local' } },
		select: { id: true }
	})
	const userIds = users.map(user => user.id)

	const participants = await prisma.matchParticipant.findMany({
		where: { userId: { in: userIds } },
		select: { matchId: true }
	})
	const matchIds = [...new Set(participants.map(item => item.matchId))]

	await prisma.$transaction([
		prisma.eloHistory.deleteMany({ where: { matchId: { in: matchIds } } }),
		prisma.matchParticipant.deleteMany({
			where: { matchId: { in: matchIds } }
		}),
		prisma.match.deleteMany({ where: { id: { in: matchIds } } }),
		prisma.playerStats.deleteMany({ where: { userId: { in: userIds } } }),
		prisma.news.deleteMany({ where: { authorId: { in: userIds } } }),
		prisma.user.deleteMany({ where: { id: { in: userIds } } })
	])

	console.log(`Removed ${userIds.length} demo users.`)
}

;(process.argv.includes('--remove') ? remove() : seed())
	.catch(error => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(() => prisma.$disconnect())
