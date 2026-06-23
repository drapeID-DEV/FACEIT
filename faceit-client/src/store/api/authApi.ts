import { ILoginReq, IRegisterReq } from '@/shared/types/api/requests';
import { api } from './baseApi';
import { IInfoMessageRes, IUserData } from '@/shared/types/api/responses';
import { IUser } from '@/shared/types/user';

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<IInfoMessageRes | IUser, ILoginReq>({
			query: (data) => ({
				url: '/auth/login',
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['Profile']
		}),
		register: builder.mutation<IInfoMessageRes, IRegisterReq>({
			query: (data) => ({
				url: '/auth/register',
				method: 'POST',
				body: data
			})
		}),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: '/auth/logout',
				method: 'POST'
			}),
			invalidatesTags: ['Profile']
		}),
		newVerification: builder.mutation<void, string | null>({
			query: (token) => ({
				url: '/auth/email-confirmation',
				method: 'POST',
				body: {
					token
				}
			})
		})
	})
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useNewVerificationMutation
} = authApi;
