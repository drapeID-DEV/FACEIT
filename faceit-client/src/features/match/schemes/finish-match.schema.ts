import * as z from 'zod';

const count = z
	.number({
		message: 'Input a number'
	})
	.int({
		message: 'Input a whole number'
	})
	.min(0, {
		message: 'Cannot be negative'
	});

export const FinishMatchSchema = z.object({
	winnerTeam: z.number().int().min(1).max(2),
	team1Score: count,
	team2Score: count,
	playerStats: z.array(
		z.object({
			userId: z.string(),
			kills: count,
			deaths: count,
			assists: count,
			headshots: count,
			mvpRounds: count
		})
	)
});

export type TFinishMatchSchema = z.infer<typeof FinishMatchSchema>;
