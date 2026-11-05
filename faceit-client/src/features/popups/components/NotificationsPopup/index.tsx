'use client';

import { Loader } from '@/shared/components/ui/Loader';
import { TApiError } from '@/shared/types/api/responses';
import { notification } from '@/shared/utils/notifications';
import {
	useGetNotificationsQuery,
	useMarkAllNotificationsReadMutation
} from '@/store/api/notificationApi';

import { NotificationsList } from './NotificationsList';

export function NotificationsPopup() {
	const { data, isLoading } = useGetNotificationsQuery();
	const [markAllRead, { isLoading: isMarking }] =
		useMarkAllNotificationsReadMutation();

	const handleMarkAll = async () => {
		try {
			await markAllRead().unwrap();
		} catch (error) {
			const err = error as TApiError;

			notification.error(
				err.data?.message ?? 'Failed to mark notifications as read'
			);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!data) {
		return (
			<p className="text-sm text-center">Unable to load notifications</p>
		);
	}

	if (data.notifications.length === 0) {
		return <p className="pt-4 text-sm text-center">No notifications yet</p>;
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			{data.unreadCount > 0 && (
				<button
					type="button"
					disabled={isMarking}
					onClick={handleMarkAll}
					className="self-end px-5 pt-3 text-xs text-neutral-400 transition hover:cursor-pointer hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
				>
					Mark all as read
				</button>
			)}
			<NotificationsList notifications={data.notifications} />
		</div>
	);
}
