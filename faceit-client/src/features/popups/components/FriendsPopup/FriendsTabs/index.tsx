'use client';

import { useGetFriendRequestsQuery } from '@/store/api/friendshipApi';

type Tab = 'friends' | 'requests';

interface Props {
	activeTab: Tab;
	onChange: (tab: Tab) => void;
}

export function FriendsTabs({ activeTab, onChange }: Props) {
	const { data: requests } = useGetFriendRequestsQuery();

	const requestsCount = requests?.length ?? 0;

	return (
		<div className="flex border-b border-white/10">
			<button
				type="button"
				onClick={() => onChange('friends')}
				className={`flex-1 px-4 py-3 pt-0 text-sm font-bold transition ${
					activeTab === 'friends'
						? 'border-b-2 border-widget text-white'
						: 'border-b-2 border-transparent text-gray-400 hover:text-white'
				}`}
			>
				Friends
			</button>
			<button
				type="button"
				onClick={() => onChange('requests')}
				className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 pt-0 text-sm font-bold transition ${
					activeTab === 'requests'
						? 'border-b-2 border-widget text-white'
						: 'border-b-2 border-transparent text-gray-400 hover:text-white'
				}`}
			>
				Requests
				{requestsCount > 0 && (
					<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-widget px-1 text-xs font-bold text-white">
						{requestsCount}
					</span>
				)}
			</button>
		</div>
	);
}
