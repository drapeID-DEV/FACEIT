import { USERS } from '@/shared/data/users.data'
import { FriendItem } from './FriendItem'

export function FriendsList() {
	return (
		<ul className="flex flex-col gap-3 px-5 mb-3 overflow-y-auto">
			{USERS['u1'].friends.map((friend) => (
				<FriendItem key={friend} friendId={friend} />
			))}
		</ul>
	)
}
