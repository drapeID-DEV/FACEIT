'use client';

import { useGetEloHistoryQuery } from '@/store/api/playerApi';
import { EloChart } from './EloChart';

interface Props {
	nickname: string;
}

export function EloStatistics({ nickname }: Props) {
	const { data } = useGetEloHistoryQuery(nickname);

	if (!data)
		return (
			<div className="bg-primary text-center py-8 px-5 rounded-2xl">
				<h2 className="text-white text-2xl mb-5 font-bold">
					Elo history
				</h2>
				<p className="text-xl">Unable to load history</p>
			</div>
		);

	return (
		<div className="bg-primary text-center py-8 px-5 rounded-2xl">
			<h2 className="text-white text-2xl mb-5 font-bold">Elo history</h2>
			<EloChart history={data} />
		</div>
	);
}
