import { IPlayerProfile, IUserData } from '@/shared/types/api/responses';
import { api } from './baseApi';
import { TSettingsSchema } from '@/features/user/schemes/settings.schema';

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMe: builder.query<IUserData, void>({
			query: () => '/users/me',
			providesTags: ['Profile']
		}),
		getPublicProfile: builder.query<IPlayerProfile, string>({
			query: (nickname) => `/users/profile/${nickname}`,
			providesTags: ['Profile']
		}),
		updateProfile: builder.mutation<void, TSettingsSchema>({
			query: (data) => ({
				url: '/users/profile',
				method: 'PATCH',
				body: data
			}),
			invalidatesTags: ['Profile']
		}),
		uploadAvatar: builder.mutation<void, FormData>({
			query: (data) => ({
				url: '/users/profile-picture',
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['Profile']
		})
	})
});

export const {
	useGetMeQuery,
	useGetPublicProfileQuery,
	useUpdateProfileMutation,
	useUploadAvatarMutation
} = userApi;
