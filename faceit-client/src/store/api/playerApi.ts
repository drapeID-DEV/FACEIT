import { IEloHistoryItem } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { IMatchHistoryItem } from '@/shared/types/match-history';
import {
	IAiRecommendationsResponse,
	IPlayerStatistics
} from '@/shared/types/stats';

export const playerApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMatchesHistory: builder.query<IMatchHistoryItem[], string>({
			query: (nickname) => `/player/${nickname}/matches`
		}),
		getEloHistory: builder.query<IEloHistoryItem[], string>({
			query: (nickname) => `/player/${nickname}/elo-history`
		}),
		getPlayerStatistics: builder.query<IPlayerStatistics, string>({
			query: (nickname) => `/player/${nickname}/statistics`
		}),
		getPlayerRecommendations: builder.query<
			IAiRecommendationsResponse,
			{
				nickname: string;
				regenerate?: boolean;
			}
		>({
			query: ({ nickname, regenerate }) => ({
				url: `/ai/player/${nickname}/recommendations`,
				params: regenerate ? { regenerate: true } : undefined
			})
		})
	})
});

export const {
	useGetMatchesHistoryQuery,
	useGetEloHistoryQuery,
	useGetPlayerStatisticsQuery,
	useGetPlayerRecommendationsQuery,
	useLazyGetPlayerRecommendationsQuery
} = playerApi;
