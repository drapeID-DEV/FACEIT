import { IInfoMessageRes } from '@/shared/types/api/responses';
import { IPartyStateRes } from '@/shared/types/party';
import { api } from './baseApi';

export const partyApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getParty: builder.query<IPartyStateRes, void>({
			query: () => '/party',
			providesTags: ['Party']
		}),
		inviteToParty: builder.mutation<IInfoMessageRes, string>({
			query: (userId) => ({
				url: `/party/invite/${userId}`,
				method: 'POST'
			}),
			invalidatesTags: ['Party']
		}),
		acceptPartyInvite: builder.mutation<IInfoMessageRes, string>({
			query: (partyId) => ({
				url: `/party/invites/${partyId}/accept`,
				method: 'POST'
			}),
			invalidatesTags: ['Party']
		}),
		declinePartyInvite: builder.mutation<IInfoMessageRes, string>({
			query: (partyId) => ({
				url: `/party/invites/${partyId}/decline`,
				method: 'POST'
			}),
			invalidatesTags: ['Party']
		}),
		leaveParty: builder.mutation<IInfoMessageRes, void>({
			query: () => ({
				url: '/party/leave',
				method: 'POST'
			}),
			invalidatesTags: ['Party', 'Queue']
		}),
		kickFromParty: builder.mutation<IInfoMessageRes, string>({
			query: (userId) => ({
				url: `/party/kick/${userId}`,
				method: 'POST'
			}),
			invalidatesTags: ['Party', 'Queue']
		})
	})
});

export const {
	useGetPartyQuery,
	useInviteToPartyMutation,
	useAcceptPartyInviteMutation,
	useDeclinePartyInviteMutation,
	useLeavePartyMutation,
	useKickFromPartyMutation
} = partyApi;
