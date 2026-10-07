'use client';

import { useGetPublicProfileQuery } from '@/store/api/userApi';
import { UserCard } from './UserCard';
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import { Loader } from '@/shared/components/ui/Loader';

interface Props {
	nickname: string;
}

export function UserProfile({ nickname }: Props) {
	const { data, isLoading, error } = useGetPublicProfileQuery(nickname);

	if (isLoading) {
		return <Loader />;
	}

	if (!data) {
		return null;
	}

	if (error) {
		const err = error as TApiError;

		notification.error(
			err.data?.message ?? 'Failed to load player profile'
		);

		return null;
	}

	//MAKE THE SKELETON WHILE LOADING
	return <UserCard userData={data} />;
}
