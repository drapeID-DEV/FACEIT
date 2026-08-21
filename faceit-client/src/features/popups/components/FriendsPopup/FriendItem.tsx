import { AvatarBtn } from '@/shared/components/ui/AvatarBtn';
import { IFriend } from '@/shared/types/api/responses';
import Link from 'next/link';

interface Props {
	friend: IFriend;
}

export function FriendItem({ friend }: Props) {
	return (
		<Link
			href={`/players/${friend.nickname}`}
			className="flex py-3 px-3 rounded-2xl gap-3 items-center hover:bg-accent hover:cursor-pointer duration-300"
		>
			<AvatarBtn nickname={friend.nickname} />
			<p className="text-md font-bold">{friend.nickname}</p>
		</Link>
	);
}
