import { IUserData } from '@/shared/types/user';
import { api } from './baseApi';
import { TSettingsSchema } from '@/features/user/schemes/settings.schema';
import { IPlayerProfileRes } from '@/shared/types/api/responses';

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getMe: builder.query<IUserData, void>({
			query: () => '/users/me',
			providesTags: ['Profile']
		}),
		getPublicProfile: builder.query<IPlayerProfileRes, string>({
			query: (nickname) => `/users/profile/${nickname}`
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
