import { NOTIFICATIONS } from '@/shared/data/notifications.data'
import { NotificationItem } from './NotificationItem'

interface Props {}

export function NotificationsList({}: Props) {
	return (
		<ul className="flex flex-col gap-10 px-5 mb-3 overflow-y-auto">
			{NOTIFICATIONS.map((notif, index) => (
				<NotificationItem key={index} notif={notif} />
			))}
		</ul>
	)
}
