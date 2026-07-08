import { Prisma } from 'generated/prisma'

export const matchWithParticipantsInclude =
	Prisma.validator<Prisma.MatchInclude>()({
		participants: {
			include: {
				user: {
					select: {
						id: true,
						nickname: true,
						profilePic: true,
						elo: true
					}
				}
			}
		}
	})

export type MatchWithParticipants = Prisma.MatchGetPayload<{
	include: typeof matchWithParticipantsInclude
}>
