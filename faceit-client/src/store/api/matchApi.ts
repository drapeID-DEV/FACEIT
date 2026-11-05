import { ICurrentMatchRes, IMapBanState } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { IMatch } from '@/shared/types/match';
import { TFinishMatchSchema } from '@/features/match/schemes/finish-match.schema';

export const matchApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMatch: builder.query<IMatch, string>({
			query: (id) => `/match/${id}`,
			providesTags: ['Match']
		}),
		finishMatch: builder.mutation<
			IMatch,
			{ matchId: string; data: TFinishMatchSchema }
		>({
			query: ({ matchId, data }) => ({
				url: `/match/${matchId}/finish`,
				method: 'PATCH',
				body: data
			}),
			invalidatesTags: ['Match', 'MapBan', 'CurrentMatch']
		}),
		cancelMatch: builder.mutation<IMatch, string>({
			query: (matchId) => ({
				url: `/match/${matchId}/cancel`,
				method: 'PATCH'
			}),
			invalidatesTags: ['Match', 'MapBan', 'CurrentMatch']
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
	useGetMapBanStateQuery,
	useFinishMatchMutation,
	useCancelMatchMutation
} = matchApi;
