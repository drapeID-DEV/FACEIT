import { INotification } from '@/shared/types/notifications';

import { NotificationItem } from './NotificationItem';

interface Props {
	notifications: INotification[];
}

export function NotificationsList({ notifications }: Props) {
	return (
		<ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
			{notifications.map((notif) => (
				<NotificationItem key={notif.id} notif={notif} />
			))}
		</ul>
	);
}
