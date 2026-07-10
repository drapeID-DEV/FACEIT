import { ICurrentMatchResponse } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { IMatch } from '@/shared/types/match';

export const matchApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// updateProfile: builder.mutation<void, TSettingsSchema>({
		// 	query: (data) => ({
		// 		url: '/users/profile',
		// 		method: 'PATCH',
		// 		body: data
		// 	}),
		// 	invalidatesTags: ['Profile']
		// }),
		getMatch: builder.query<IMatch, string>({
			query: (id) => `/match/${id}`
		}),
		getActiveMatch: builder.query<ICurrentMatchResponse, void>({
			query: () => '/match/current',
			providesTags: ['CurrentMatch']
		})
	})
});

export const { useGetActiveMatchQuery, useGetMatchQuery } = matchApi;
