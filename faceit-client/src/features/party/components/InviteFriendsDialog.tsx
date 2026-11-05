'use client';

import { X } from 'lucide-react';

import { Loader } from '@/shared/components/ui/Loader';
import { PlayerAvatar } from '@/shared/components/ui/PlayerAvatar';
import { TApiError } from '@/shared/types/api/responses';
import { IParty } from '@/shared/types/party';
import { notification } from '@/shared/utils/notifications';
import { useGetFriendsQuery } from '@/store/api/friendshipApi';
import { useInviteToPartyMutation } from '@/store/api/partyApi';

interface Props {
	party: IParty | null;
	onClose: () => void;
}

export function InviteFriendsDialog({ party, onClose }: Props) {
	const { data: friends, isLoading } = useGetFriendsQuery();
	const [invite, { isLoading: isInviting }] = useInviteToPartyMutation();

	const memberIds = party?.members.map((member) => member.id) ?? [];
	const invitedIds = party?.pendingInvites.map((user) => user.id) ?? [];

	const available = friends?.filter(
		(friend) => !memberIds.includes(friend.id)
	);

	const handleInvite = async (userId: string) => {
		try {
			await invite(userId).unwrap();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<div
			className="fixed inset-0 z-[997] flex items-center justify-center bg-black/70 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="flex max-h-[70vh] w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-800 bg-primary p-6 shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Invite a friend</h2>
					<button
						type="button"
						aria-label="Close"
						onClick={onClose}
						className="text-neutral-400 duration-200 hover:text-white"
					>
						<X size={20} />
					</button>
				</div>
				{isLoading ? (
					<div className="flex justify-center py-6">
						<Loader />
					</div>
				) : !available?.length ? (
					<p className="py-6 text-center text-sm text-neutral-400">
						Only friends can join your party. Add some from their
						profile first.
					</p>
				) : (
					<ul className="flex flex-col gap-2 overflow-y-auto">
						{available.map((friend) => {
							const isInvited = invitedIds.includes(friend.id);

							return (
								<li
									key={friend.id}
									className="flex items-center gap-3 rounded-xl bg-accent p-3"
								>
									<PlayerAvatar
										nickname={friend.nickname}
										profilePic={friend.profilePic}
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium">
											{friend.nickname}
										</p>
										<p className="text-xs text-neutral-400">
											{friend.elo} ELO
										</p>
									</div>
									<button
										type="button"
										disabled={isInvited || isInviting}
										onClick={() => handleInvite(friend.id)}
										className="rounded-lg bg-widget px-4 py-1.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
									>
										{isInvited ? 'Invited' : 'Invite'}
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}
