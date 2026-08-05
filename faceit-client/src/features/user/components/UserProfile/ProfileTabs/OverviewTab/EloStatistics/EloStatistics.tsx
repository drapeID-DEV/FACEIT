'use client';

import { useGetEloHistoryQuery } from '@/store/api/playerApi';
import { EloChart } from './EloChart';
import { ChartContainer } from './ChartContainer';

interface Props {
	nickname: string;
}

export function EloStatistics({ nickname }: Props) {
	const { data } = useGetEloHistoryQuery(nickname);

	if (!data)
		return (
			<ChartContainer>
				<p className="text-xl text-widget">Unable to load history</p>
			</ChartContainer>
		);

	if (!data.length)
		return (
			<ChartContainer>
				<p className="text-xl text-widget">No recent matches</p>
			</ChartContainer>
		);

	return (
		<ChartContainer>
			<EloChart history={data} />
		</ChartContainer>
	);
}
