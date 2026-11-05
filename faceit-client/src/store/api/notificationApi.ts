import { IInfoMessageRes } from '@/shared/types/api/responses';
import { INotificationsRes } from '@/shared/types/notifications';
import { api } from './baseApi';

export const notificationApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query<INotificationsRes, void>({
			query: () => '/notifications',
			providesTags: ['Notifications']
		}),
		markNotificationRead: builder.mutation<IInfoMessageRes, string>({
			query: (id) => ({
				url: `/notifications/${id}/read`,
				method: 'PATCH'
			}),
			invalidatesTags: ['Notifications']
		}),
		markAllNotificationsRead: builder.mutation<IInfoMessageRes, void>({
			query: () => ({
				url: '/notifications/read-all',
				method: 'PATCH'
			}),
			invalidatesTags: ['Notifications']
		})
	})
});

export const {
	useGetNotificationsQuery,
	useMarkNotificationReadMutation,
	useMarkAllNotificationsReadMutation
} = notificationApi;
