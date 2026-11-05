'use client';

import { formatDistanceToNow } from 'date-fns';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

import { PlayerAvatar } from '@/shared/components/ui/PlayerAvatar';
import { INotification } from '@/shared/types/notifications';
import { getNotificationContent } from '@/shared/utils/notificationContent';
import { useMarkNotificationReadMutation } from '@/store/api/notificationApi';
import { closePopupMenu } from '@/store/slices/SidebarStateSlice';
import { AppDispatch } from '@/store/store';

interface Props {
	notif: INotification;
}

export function NotificationItem({ notif }: Props) {
	const dispatch = useDispatch<AppDispatch>();
	const [markRead] = useMarkNotificationReadMutation();

	const { title, text, link } = getNotificationContent(notif);

	const handleClick = () => {
		if (!notif.isRead) {
			markRead(notif.id);
		}

		dispatch(closePopupMenu());
	};

	return (
		<li>
			<Link
				href={link}
				onClick={handleClick}
				className="flex w-full items-center gap-2 rounded-xl p-3 transition hover:bg-neutral-800"
			>
				{notif.actor ? (
					<PlayerAvatar
						nickname={notif.actor.nickname}
						profilePic={notif.actor.profilePic}
					/>
				) : (
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-neutral-400">
						<Trophy size={18} />
					</div>
				)}
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<h2 className="text-xs text-neutral-400">{title}</h2>
					<p className="text-xs break-words">{text}</p>
					<time
						dateTime={notif.createdAt}
						className="text-xs text-neutral-500"
					>
						{formatDistanceToNow(new Date(notif.createdAt), {
							addSuffix: true
						})}
					</time>
				</div>
				{!notif.isRead && (
					<span
						className="h-2 w-2 shrink-0 rounded-full bg-widget"
						aria-label="Unread"
					/>
				)}
			</Link>
		</li>
	);
}
