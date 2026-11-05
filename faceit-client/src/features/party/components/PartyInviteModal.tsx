'use client';

import { PlayerAvatar } from '@/shared/components/ui/PlayerAvatar';
import { TApiError } from '@/shared/types/api/responses';
import { notification } from '@/shared/utils/notifications';
import {
	useAcceptPartyInviteMutation,
	useDeclinePartyInviteMutation,
	useGetPartyQuery
} from '@/store/api/partyApi';

// Stays on top of every page, an invite only lives for a minute
export function PartyInviteModal() {
	const { data } = useGetPartyQuery();
	const [acceptInvite, { isLoading: isAccepting }] =
		useAcceptPartyInviteMutation();
	const [declineInvite, { isLoading: isDeclining }] =
		useDeclinePartyInviteMutation();

	const invite = data?.invites[0];

	if (!invite) {
		return null;
	}

	const handle = async (action: typeof acceptInvite) => {
		try {
			await action(invite.partyId).unwrap();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<div className="fixed right-24 top-4 z-[998] w-80 rounded-2xl border border-zinc-800 bg-primary p-5 shadow-2xl">
			<div className="flex items-center gap-3">
				<PlayerAvatar
					nickname={invite.inviter.nickname}
					profilePic={invite.inviter.profilePic}
				/>
				<div className="min-w-0">
					<p className="truncate font-semibold">
						{invite.inviter.nickname}
					</p>
					<p className="text-sm text-neutral-400">
						invited you to a party
					</p>
				</div>
			</div>
			<div className="mt-4 flex gap-3">
				<button
					type="button"
					disabled={isAccepting || isDeclining}
					onClick={() => handle(acceptInvite)}
					className="h-10 flex-1 rounded-lg bg-widget font-semibold text-white duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Accept
				</button>
				<button
					type="button"
					disabled={isAccepting || isDeclining}
					onClick={() => handle(declineInvite)}
					className="h-10 flex-1 rounded-lg bg-accent font-semibold text-white duration-200 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Decline
				</button>
			</div>
		</div>
	);
}
