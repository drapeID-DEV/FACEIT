import { NotificationsList } from './NotificationsList'
import { PopupHeader } from './PopupHeader'

interface Props {}

export function NotificationsPopup({}: Props) {
	return (
		<>
			<PopupHeader />
			<NotificationsList />
		</>
	)
}
