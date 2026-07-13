import { ICurrentMatchRes } from '@/shared/types/api/responses';
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
		})
	})
});

export const { useGetActiveMatchQuery, useGetMatchQuery } = matchApi;
