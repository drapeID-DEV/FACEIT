import { IFriend, IFriendshipStatus } from '@/shared/types/api/responses';
import { api } from './baseApi';

export const friendshipApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getFriends: builder.query<IFriend[], void>({
			query: () => '/friends',
			providesTags: ['Friends']
		}),
		getFriendRequests: builder.query<IFriend[], void>({
			query: () => '/friends/requests',
			providesTags: ['FriendRequests']
		}),
		getFriendshipStatus: builder.query<IFriendshipStatus, string>({
			query: (userId) => `/friends/status/${userId}`,
			providesTags: (_result, _error, userId) => [
				{
					type: 'FriendshipStatus',
					id: userId
				}
			]
		}),
		addFriend: builder.mutation<void, string>({
			query: (userId) => ({
				url: `/friends/${userId}`,
				method: 'POST'
			}),
			invalidatesTags: (_result, _error, userId) => [
				'Friends',
				'FriendRequests',
				{
					type: 'FriendshipStatus',
					id: userId
				}
			]
		}),
		acceptFriendRequest: builder.mutation<void, string>({
			query: (userId) => ({
				url: `/friends/${userId}/accept`,
				method: 'POST'
			}),
			invalidatesTags: (_result, _error, userId) => [
				'Friends',
				'FriendRequests',
				{
					type: 'FriendshipStatus',
					id: userId
				}
			]
		}),
		declineFriendRequest: builder.mutation<void, string>({
			query: (userId) => ({
				url: `/friends/${userId}/decline`,
				method: 'POST'
			}),
			invalidatesTags: (_result, _error, userId) => [
				'FriendRequests',
				{
					type: 'FriendshipStatus',
					id: userId
				}
			]
		}),
		removeFriend: builder.mutation<void, string>({
			query: (userId) => ({
				url: `/friends/${userId}`,
				method: 'DELETE'
			}),
			invalidatesTags: (_result, _error, userId) => [
				'Friends',
				{
					type: 'FriendshipStatus',
					id: userId
				}
			]
		})
	})
});

export const {
	useGetFriendsQuery,
	useGetFriendRequestsQuery,
	useGetFriendshipStatusQuery,
	useAddFriendMutation,
	useAcceptFriendRequestMutation,
	useDeclineFriendRequestMutation,
	useRemoveFriendMutation
} = friendshipApi;
