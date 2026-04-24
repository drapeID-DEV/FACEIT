import { FriendsList } from './FriendsList'
import { PopupHeader } from './PopupHeader'

interface Props {}

export function FriendsPopup({}: Props) {
	return (
		<>
			<PopupHeader />
			<FriendsList />
		</>
	)
}
