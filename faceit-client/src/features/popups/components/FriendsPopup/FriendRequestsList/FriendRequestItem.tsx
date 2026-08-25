'use client';

import { AvatarBtn } from '@/shared/components/ui/AvatarBtn';
import { IFriend } from '@/shared/types/api/responses';
import {
	useAcceptFriendRequestMutation,
	useDeclineFriendRequestMutation
} from '@/store/api/friendshipApi';
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

interface Props {
	request: IFriend;
}

export function FriendRequestItem({ request }: Props) {
	const [acceptFriendRequest, { isLoading: isAccepting }] =
		useAcceptFriendRequestMutation();

	const [declineFriendRequest, { isLoading: isDeclining }] =
		useDeclineFriendRequestMutation();

	const isLoading = isAccepting || isDeclining;

	const handleAccept = async () => {
		try {
			const response = await acceptFriendRequest(request.id).unwrap();

			notification.success(response.message);
		} catch (error) {
			const err = error as TApiError;

			notification.error(
				err.data?.message ?? 'Failed to accept friend request'
			);
		}
	};

	const handleDecline = async () => {
		try {
			const response = await declineFriendRequest(request.id).unwrap();

			notification.success(response.message);
		} catch (error) {
			const err = error as TApiError;

			notification.error(
				err.data?.message ?? 'Failed to decline friend request'
			);
		}
	};

	return (
		<li className="flex min-w-0 items-center gap-2 rounded-2xl px-3 py-2">
			<Link
				href={`/players/${request.nickname}`}
				className="flex min-w-0 flex-1 items-center gap-2"
			>
				<AvatarBtn nickname={request.nickname} />
				<p className="min-w-0 truncate text-sm font-bold">
					{request.nickname}
				</p>
			</Link>
			<div className="flex shrink-0 gap-1.5">
				<button
					type="button"
					disabled={isLoading}
					onClick={handleAccept}
					className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-base font-bold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
					aria-label={`Accept ${request.nickname}'s friend request`}
				>
					<Check />
				</button>
				<button
					type="button"
					disabled={isLoading}
					onClick={handleDecline}
					className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-700 text-base font-bold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
					aria-label={`Decline ${request.nickname}'s friend request`}
				>
					<X />
				</button>
			</div>
		</li>
	);
}
