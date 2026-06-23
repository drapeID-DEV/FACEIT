import { IUserData } from '@/shared/types/api/responses';
import { api } from './baseApi';

export const userApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query<IUserData, void>({
			query: () => '/users/profile',
			providesTags: ['Profile']
		})
	})
});

export const { useGetProfileQuery } = userApi;
