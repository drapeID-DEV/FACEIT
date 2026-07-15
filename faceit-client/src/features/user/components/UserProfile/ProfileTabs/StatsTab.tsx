'use client';

import { PlayerStatsGrid } from '@/features/stats/PlayerStatsGrid';
import { Loader } from '@/shared/components/ui/Loader';
import { TApiError } from '@/shared/types/api/responses';
import { notification } from '@/shared/utils/notifications';
import { useGetPublicProfileQuery } from '@/store/api/userApi';

interface Props {
	nickname: string;
}

export function StatsTab({ nickname }: Props) {
	const { data, isLoading, isError, error } =
		useGetPublicProfileQuery(nickname);

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		const err = error as TApiError;
		notification.info(err.data.message);
		return null;
	}

	return (
		<div className="flex flex-wrap gap-10 justify-between">
			<PlayerStatsGrid
				variant="card"
				playerStats={data?.playerStats}
				items={[
					'matches',
					'wins',
					'losses',
					'winRate',
					'avg',
					'kd',
					'kills',
					'deaths',
					'assists'
				]}
			/>
		</div>
	);
}
