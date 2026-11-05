'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { socket } from '@/shared/lib/socket';
import { api } from '@/store/api/baseApi';
import { AppDispatch } from '@/store/store';
import { matchmakingApi } from '@/store/api/matchmakingApi';
import { IMapBanState } from '@/shared/types/api/responses';
import { matchApi } from '@/store/api/matchApi';
import { INotification } from '@/shared/types/notifications';
import { getNotificationContent } from '@/shared/utils/notificationContent';
import { notification as toast } from '@/shared/utils/notifications';

export function SocketProvider({ children }: PropsWithChildren) {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const invalidate = (
			...tags: ('Queue' | 'CurrentMatch' | 'Acceptance' | 'Party')[]
		) => dispatch(api.util.invalidateTags(tags));

		const onPartyChanged = () => {
			invalidate('Party');
		};

		const onQueueUpdated = () => {
			invalidate('Queue');
		};

		const onMatchReady = () => {
			invalidate('Queue', 'Acceptance');
		};

		const onAcceptedUpdated = (data: {
			acceptedPlayers: number;
			totalPlayers: number;
		}) => {
			dispatch(
				matchmakingApi.util.updateQueryData(
					'getCurrentAcceptance',
					undefined,
					(draft) => {
						if (!draft.hasAcceptance) {
							return;
						}

						draft.acceptance.acceptedPlayers = data.acceptedPlayers;
						draft.acceptance.totalPlayers = data.totalPlayers;
					}
				)
			);
		};

		const onMatchCancelled = () => {
			invalidate('Queue', 'Acceptance');
		};

		const onMatchCreated = (match: { id: string }) => {
			invalidate('Queue', 'CurrentMatch', 'Acceptance');

			router.push(`/match/${match.id}`);
		};

		const onNotificationCreated = (notification: INotification) => {
			dispatch(api.util.invalidateTags(['Notifications']));

			// The friends popup and the sender's profile page follow the request live
			if (notification.actor) {
				dispatch(
					api.util.invalidateTags([
						'Friends',
						'FriendRequests',
						{
							type: 'FriendshipStatus',
							id: notification.actor.id
						}
					])
				);
			}

			toast.info(getNotificationContent(notification).text);
		};

		const onNotificationsRead = () => {
			dispatch(api.util.invalidateTags(['Notifications']));
		};

		socket.on('notificationCreated', onNotificationCreated);
		socket.on('notificationsRead', onNotificationsRead);
		socket.on('matchReady', onMatchReady);
		socket.on('acceptedUpdated', onAcceptedUpdated);
		socket.on('matchCancelled', onMatchCancelled);
		socket.on('matchCreated', onMatchCreated);
		socket.on('partyUpdated', onPartyChanged);
		socket.on('partyInvite', onPartyChanged);
		socket.on('queueUpdated', onQueueUpdated);

		socket.connect();

		return () => {
			socket.off('notificationCreated', onNotificationCreated);
			socket.off('notificationsRead', onNotificationsRead);
			socket.off('matchReady', onMatchReady);
			socket.off('acceptedUpdated', onAcceptedUpdated);
			socket.off('matchCancelled', onMatchCancelled);
			socket.off('matchCreated', onMatchCreated);
			socket.off('partyUpdated', onPartyChanged);
			socket.off('partyInvite', onPartyChanged);
			socket.off('queueUpdated', onQueueUpdated);

			socket.disconnect();
		};
	}, [dispatch, router]);

	return children;
}
