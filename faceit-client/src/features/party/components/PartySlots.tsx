'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Crown, Plus, X } from 'lucide-react';

import { PlayerAvatar } from '@/shared/components/ui/PlayerAvatar';
import { TApiError } from '@/shared/types/api/responses';
import { IPartyUser } from '@/shared/types/party';
import { notification } from '@/shared/utils/notifications';
import {
	useGetPartyQuery,
	useKickFromPartyMutation,
	useLeavePartyMutation
} from '@/store/api/partyApi';
import { useGetMeQuery } from '@/store/api/userApi';

import { InviteFriendsDialog } from './InviteFriendsDialog';

const slotClassName =
	'flex h-52 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-primary p-4 text-center';

interface Props {
	teamSize: number;
	isLocked: boolean;
}

export function PartySlots({ teamSize, isLocked }: Props) {
	const { data: me } = useGetMeQuery();
	const { data } = useGetPartyQuery();
	const [kick] = useKickFromPartyMutation();
	const [leave, { isLoading: isLeaving }] = useLeavePartyMutation();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const party = data?.party ?? null;
	const isLeader = !party || party.leaderId === me?.id;
	const canInvite = isLeader && !isLocked;

	const members: IPartyUser[] =
		party?.members ??
		(me
			? [
					{
						id: me.id,
						nickname: me.nickname,
						profilePic: me.profilePic,
						elo: me.elo
					}
				]
			: []);
	const pending = party?.pendingInvites ?? [];
	const emptySlots = Math.max(0, teamSize - members.length - pending.length);

	const handle = async (action: () => { unwrap: () => Promise<unknown> }) => {
		try {
			await action().unwrap();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">
					Party{' '}
					<span className="text-sm font-normal text-neutral-400">
						{members.length}/{teamSize}
					</span>
				</h2>
				{(party?.members.length ?? 0) > 1 && (
					<button
						type="button"
						disabled={isLeaving}
						onClick={() => handle(() => leave())}
						className="text-sm text-neutral-400 duration-200 hover:text-white disabled:opacity-50"
					>
						Leave party
					</button>
				)}
			</div>
			<ul
				className="grid gap-3"
				style={{
					gridTemplateColumns: `repeat(${teamSize}, minmax(0, 1fr))`
				}}
			>
				{members.map((member) => (
					<li key={member.id} className={`${slotClassName} relative`}>
						{canInvite && member.id !== me?.id && (
							<button
								type="button"
								aria-label={`Kick ${member.nickname}`}
								onClick={() => handle(() => kick(member.id))}
								className="absolute right-3 top-3 text-neutral-500 duration-200 hover:text-red-400"
							>
								<X size={16} />
							</button>
						)}
						<PlayerAvatar
							nickname={member.nickname}
							profilePic={member.profilePic}
							className="h-20 w-20 text-2xl"
						/>
						<Link
							href={`/players/${member.nickname}`}
							className="flex max-w-full items-center gap-1 font-semibold hover:text-widget"
						>
							{party?.leaderId === member.id && (
								<Crown
									size={14}
									className="shrink-0 text-widget"
								/>
							)}
							<span className="truncate">{member.nickname}</span>
						</Link>
						<p className="text-xs text-neutral-400">
							{member.elo} ELO
						</p>
					</li>
				))}
				{pending.map((user) => (
					<li
						key={user.id}
						className={`${slotClassName} border-dashed opacity-70`}
					>
						<Clock size={24} className="text-neutral-400" />
						<p className="max-w-full truncate font-medium">
							{user.nickname}
						</p>
						<p className="text-xs text-neutral-400">Invited...</p>
					</li>
				))}
				{Array.from({ length: emptySlots }, (_, index) => (
					<li key={index}>
						<button
							type="button"
							disabled={!canInvite}
							aria-label="Invite a friend"
							onClick={() => setIsDialogOpen(true)}
							className={`${slotClassName} text-neutral-500 duration-200 enabled:hover:bg-accent enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-50`}
						>
							<Plus size={36} />
						</button>
					</li>
				))}
			</ul>
			{isDialogOpen && (
				<InviteFriendsDialog
					party={party}
					onClose={() => setIsDialogOpen(false)}
				/>
			)}
		</section>
	);
}
