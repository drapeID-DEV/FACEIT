import {
	ILeaderboardRes,
	IMyLeaderboardRes
} from '@/shared/types/api/responses';
import { api } from './baseApi';

export const leaderboardApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getLeaderboard: builder.query<
			ILeaderboardRes,
			{ page: number; limit: number }
		>({
			query: ({ page = 1, limit = 20 }) =>
				`/leaderboard?page=${page}&limit=${limit}`
		}),
		getMyRank: builder.query<IMyLeaderboardRes, void>({
			query: () => '/leaderboard/me'
		})
	})
});

export const { useGetLeaderboardQuery, useGetMyRankQuery } = leaderboardApi;
