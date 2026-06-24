'use client';

import { useGetPublicProfileQuery } from '@/store/api/userApi';
import { UserCard } from './UserCard';
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import { useRouter } from 'next/navigation';

interface Props {
	nickname: string;
}

export function UserProfile({ nickname }: Props) {
	const { data, isLoading, error } = useGetPublicProfileQuery(nickname);
	const router = useRouter();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!data) {
		const err = error as TApiError;
		notification.error(err.data.message);

		return null;
	}

	return (
		<div>
			<UserCard userData={data} />
		</div>
	);
}
