'use client';

import { useState } from 'react';

import { FriendsList } from './FriendsList';
import { FriendRequestsList } from './FriendRequestsList';
import { FriendsTabs } from './FriendsTabs';

type Tab = 'friends' | 'requests';

export function FriendsPopup() {
	const [activeTab, setActiveTab] = useState<Tab>('friends');

	return (
		<div className="flex h-full flex-col">
			<FriendsTabs activeTab={activeTab} onChange={setActiveTab} />
			<div className="min-h-0 flex-1 pt-3">
				{activeTab === 'friends' ? (
					<FriendsList />
				) : (
					<FriendRequestsList />
				)}
			</div>
		</div>
	);
}
