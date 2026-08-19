'use client';

import {
	useAcceptFriendRequestMutation,
	useAddFriendMutation,
	useDeclineFriendRequestMutation,
	useGetFriendshipStatusQuery,
	useRemoveFriendMutation
} from '@/store/api/friendshipApi';
import { FriendshipStatus } from '@/shared/types/api/responses';
import { useState } from 'react';

interface Props {
	userId: string;
}

export function FriendshipControls({ userId }: Props) {
	const { data: friendshipStatus, isLoading: isFriendshipLoading } =
		useGetFriendshipStatusQuery(userId, {
			refetchOnMountOrArgChange: true
		});

	const [addFriend, { isLoading: isAddingFriend }] = useAddFriendMutation();

	const [acceptFriendRequest, { isLoading: isAcceptingFriend }] =
		useAcceptFriendRequestMutation();

	const [declineFriendRequest, { isLoading: isDecliningFriend }] =
		useDeclineFriendRequestMutation();

	const [removeFriend, { isLoading: isRemovingFriend }] =
		useRemoveFriendMutation();

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const isLoading =
		isFriendshipLoading ||
		isAddingFriend ||
		isAcceptingFriend ||
		isRemovingFriend;

	if (
		isFriendshipLoading ||
		friendshipStatus?.status === FriendshipStatus.SELF
	) {
		return null;
	}

	const buttonClassName =
		'w-full box-border rounded-[14px] px-4 py-2 text-xl font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';

	switch (friendshipStatus?.status) {
		case FriendshipStatus.NONE:
			return (
				<button
					type="button"
					className={`${buttonClassName} bg-widget`}
					disabled={isLoading}
					onClick={() => addFriend(userId)}
				>
					{isAddingFriend ? 'Adding...' : 'Add Friend'}
				</button>
			);

		case FriendshipStatus.REQUEST_SENT:
			return (
				<button
					type="button"
					className={`${buttonClassName} bg-primary`}
					disabled
				>
					Request Sent
				</button>
			);

		case FriendshipStatus.REQUEST_RECEIVED:
			return (
				<div className="flex gap-3">
					<button
						type="button"
						className={`${buttonClassName} bg-blue-700`}
						disabled={isLoading}
						onClick={() => acceptFriendRequest(userId)}
					>
						{isAcceptingFriend ? 'Accepting...' : 'Accept Request'}
					</button>
					<button
						type="button"
						disabled={isLoading}
						onClick={() => declineFriendRequest(userId)}
						aria-label="Decline friend request"
						className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-red-700 text-2xl font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						×
					</button>
				</div>
			);

		case FriendshipStatus.FRIENDS:
			return (
				<div className="relative w-full">
					<button
						type="button"
						onClick={() => setIsMenuOpen((prev) => !prev)}
						className="w-full rounded-[14px] border border-accent px-4 py-2 text-xl font-bold text-white transition hover:opacity-90 hover:bg-accent"
					>
						Friends
					</button>

					{isMenuOpen && (
						<div className="absolute top-full z-10 mt-2 w-full rounded-[12px] border border-neutral-700 bg-neutral-900 p-1 shadow-lg">
							<button
								type="button"
								onClick={() => removeFriend(userId)}
								disabled={isRemovingFriend}
								className="w-full rounded-[8px] px-3 py-2 text-left font-semibold text-red-500 transition hover:bg-neutral-800 disabled:opacity-50"
							>
								{isRemovingFriend
									? 'Removing...'
									: 'Remove from friends'}
							</button>
						</div>
					)}
				</div>
			);

		default:
			return null;
	}
}
