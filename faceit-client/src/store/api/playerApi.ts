import { IEloHistoryItem } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { IMatchHistoryItem } from '@/shared/types/match-history';

export const playerApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMatchesHistory: builder.query<IMatchHistoryItem[], string>({
			query: (nickname) => `/player/${nickname}/matches`
		}),
		getEloHistory: builder.query<IEloHistoryItem[], string>({
			query: (nickname) => `/player/${nickname}/elo-history`
		})
	})
});

export const { useGetMatchesHistoryQuery, useGetEloHistoryQuery } = playerApi;
