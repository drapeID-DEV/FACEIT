import { api } from './baseApi';
import { IInfoMessageRes, IUserData } from '@/shared/types/api/responses';
import { IUser } from '@/shared/types/user';
import { TRegisterSchema } from '@/features/auth/schemes/register.schema';
import { TLoginSchema } from '@/features/auth/schemes/login.schema';
import { TResetSchema } from '@/features/auth/schemes/reset-password.schema';
import { TNewPasswordSchema } from '@/features/auth/schemes/new-password.schema';

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<IInfoMessageRes | IUser, TLoginSchema>({
			query: (data) => ({
				url: '/auth/login',
				method: 'POST',
				body: data
			}),
			invalidatesTags: ['Profile']
		}),
		register: builder.mutation<IInfoMessageRes, TRegisterSchema>({
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
		}),
		resetPassword: builder.mutation<IInfoMessageRes, TResetSchema>({
			query: (data) => ({
				url: '/auth/password-recovery/reset',
				method: 'POST',
				body: data
			})
		}),
		newPassword: builder.mutation<
			void,
			{ token: string; data: TNewPasswordSchema }
		>({
			query: ({ token, data }) => ({
				url: `/auth/password-recovery/new/${token}`,
				method: 'POST',
				body: data
			})
		})
	})
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useLogoutMutation,
	useNewVerificationMutation,
	useResetPasswordMutation,
	useNewPasswordMutation
} = authApi;
