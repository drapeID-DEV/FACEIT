'use client';

import { PlayerStatsGrid } from '@/features/stats/PlayerStatsGrid';
import { Loader } from '@/shared/components/ui/Loader';
import { TApiError } from '@/shared/types/api/responses';
import { notification } from '@/shared/utils/notifications';
import { useGetPlayerStatisticsQuery } from '@/store/api/playerApi';
import { AiPerformanceAssistant } from '@/features/stats/AiPerformanceAssistant';

interface Props {
	nickname: string;
}

export function StatsTab({ nickname }: Props) {
	const {
		data: statistics,
		isLoading: isStatisticsLoading,
		isError: isStatisticsError,
		error
	} = useGetPlayerStatisticsQuery(nickname);

	if (isStatisticsLoading) return <Loader />;

	if (isStatisticsError) {
		const err = error as TApiError;
		notification.info(err.data.message);
		return null;
	}

	if (!statistics) return null;

	return (
		<div className="space-y-8">
			<div className="flex flex-wrap gap-10 justify-between">
				<PlayerStatsGrid
					variant="card"
					playerStats={statistics}
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

			<AiPerformanceAssistant nickname={nickname} />
		</div>
	);
}
