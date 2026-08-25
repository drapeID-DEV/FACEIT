import { Loader } from '@/shared/components/ui/Loader';
import { useGetFriendsQuery } from '@/store/api/friendshipApi';
import { FriendItem } from './FriendItem';

export function FriendsList() {
	const { data, isLoading, isError } = useGetFriendsQuery();

	if (isLoading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!data || isError) {
		return <p className="text-sm text-center">Unable to load friends</p>;
	}

	return (
		<ul className="flex flex-col gap-3 px-5 mb-3 overflow-y-auto">
			{data.map((friend) => (
				<FriendItem key={friend.id} friend={friend} />
			))}
		</ul>
	);
}
