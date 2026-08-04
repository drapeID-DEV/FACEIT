import { ICurrentMatchRes, IMapBanState } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { IMatch } from '@/shared/types/match';

export const matchApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMatch: builder.query<IMatch, string>({
			query: (id) => `/match/${id}`
		}),
		getActiveMatch: builder.query<ICurrentMatchRes, void>({
			query: () => '/match/current',
			providesTags: ['CurrentMatch']
		}),
		getMapBanState: builder.query<IMapBanState, string>({
			query: (matchId) => `/match/${matchId}/map-ban`,
			providesTags: ['MapBan']
		})
	})
});

export const {
	useGetActiveMatchQuery,
	useGetMatchQuery,
	useGetMapBanStateQuery
} = matchApi;
