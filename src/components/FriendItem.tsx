import { USERS } from '@/shared/data/users.data'
import { UserID } from '@/shared/types/user'
import { AvatarBtn } from './AvatarBtn'

interface Props {
	friendId: UserID
}

export function FriendItem({ friendId }: Props) {
	const friendData = USERS[friendId]

	return (
		<div className="flex py-3 px-3 rounded-2xl gap-3 items-center hover:bg-neutral-800 hover:cursor-pointer duration-300">
			<AvatarBtn />
			<p className="text-base">{friendData.username}</p>
		</div>
	)
}
