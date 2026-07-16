import { ICurrentMatchRes } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { IMatch } from '@/shared/types/match';
import { IMatchHistoryItem } from '@/shared/types/match-history';

export const matchApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMatch: builder.query<IMatch, string>({
			query: (id) => `/match/${id}`
		}),
		getActiveMatch: builder.query<ICurrentMatchRes, void>({
			query: () => '/match/current',
			providesTags: ['CurrentMatch']
		}),
		getMatchesHistory: builder.query<IMatchHistoryItem[], string>({
			query: (nickname) => `/player/${nickname}/matches`
		})
	})
});

export const {
	useGetActiveMatchQuery,
	useGetMatchQuery,
	useGetMatchesHistoryQuery
} = matchApi;
