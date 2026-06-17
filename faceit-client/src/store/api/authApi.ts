import { ILoginReq, IRegisterReq } from '@/shared/types/api/requests';
import { api } from './baseApi';
import { IAuthRes, ILogoutRes, IUserRes } from '@/shared/types/api/responses';

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<IAuthRes, ILoginReq>({
			query: (data) => ({
				url: '/auth/login',
				method: 'POST',
				body: data
			})
		}),
		register: builder.mutation<IAuthRes, IRegisterReq>({
			query: (data) => ({
				url: '/auth/register',
				method: 'POST',
				body: data
			})
		}),
		getMe: builder.query<IUserRes, void>({
			query: () => '/auth/me'
		}),
		logout: builder.mutation<ILogoutRes, void>({
			query: () => ({
				url: '/auth/logout',
				method: 'POST'
			})
		})
	})
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useGetMeQuery,
	useLogoutMutation
} = authApi;
