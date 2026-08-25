import { Loader } from '@/shared/components/ui/Loader';
import { useGetFriendRequestsQuery } from '@/store/api/friendshipApi';
import { FriendRequestItem } from './FriendRequestItem';

export function FriendRequestsList() {
	const { data, isLoading, isError } = useGetFriendRequestsQuery();

	if (isLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (isError) {
		return (
			<p className="text-center text-sm">
				Unable to load friend requests
			</p>
		);
	}

	if (!data?.length) {
		return <p className="py-5 text-center text-sm">No friend requests</p>;
	}

	return (
		<ul className="mb-3 flex flex-col gap-3 overflow-y-auto px-5">
			{data.map((request) => (
				<FriendRequestItem key={request.id} request={request} />
			))}
		</ul>
	);
}
