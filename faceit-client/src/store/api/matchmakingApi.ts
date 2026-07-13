import {
	ICurrentMatchRes,
	IInfoMessageRes,
	IQueueStatusRes
} from '@/shared/types/api/responses';
import { api } from './baseApi';
import { TMatchType } from '@/shared/types/match';

export const matchmakingApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCurrentMatch: builder.query<ICurrentMatchRes, void>({
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
		getQueueStatus: builder.query<IQueueStatusRes, void>({
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
