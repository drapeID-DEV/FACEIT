import {
	ICurrentMatchResponse,
	IInfoMessageRes,
	IQueueStatusResponse
} from '@/shared/types/api/responses';
import { api } from './baseApi';
import { TMatchType } from '@/shared/types/match';

export const matchmakingApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// updateProfile: builder.mutation<void, TSettingsSchema>({
		// 	query: (data) => ({
		// 		url: '/users/profile',
		// 		method: 'PATCH',
		// 		body: data
		// 	}),
		// 	invalidatesTags: ['Profile']
		// }),
		getCurrentMatch: builder.query<ICurrentMatchResponse, void>({
			query: () => '/match/current',
			providesTags: ['CurrentMatch']
		}),
		joinQueue: builder.mutation<IInfoMessageRes, { matchType: TMatchType }>(
			{
				query: (data) => ({
					url: '/matchmaking/queue/join',
					method: 'POST',
					body: data
				}),
				invalidatesTags: ['CurrentMatch', 'Queue']
			}
		),
		leaveQueue: builder.mutation<IInfoMessageRes, void>({
			query: () => ({
				url: '/matchmaking/queue/leave',
				method: 'POST'
			}),
			invalidatesTags: ['Queue']
		}),
		getQueueStatus: builder.query<IQueueStatusResponse, void>({
			query: () => '/matchmaking/queue/status',
			providesTags: ['Queue']
		})
	})
});

export const {
	useGetCurrentMatchQuery,
	useJoinQueueMutation,
	useGetQueueStatusQuery,
	useLeaveQueueMutation
} = matchmakingApi;
