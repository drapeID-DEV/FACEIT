import { IPlayerStats } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { IMatch } from '@/shared/types/match';

export const statsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// updateProfile: builder.mutation<void, TSettingsSchema>({
		// 	query: (data) => ({
		// 		url: '/users/profile',
		// 		method: 'PATCH',
		// 		body: data
		// 	}),
		// 	invalidatesTags: ['Profile']
		// }),
		getPlayerStats: builder.query<IPlayerStats, string>({
			query: (id) => `/stats/${id}`
		})
	})
});

export const { useGetPlayerStatsQuery } = statsApi;
