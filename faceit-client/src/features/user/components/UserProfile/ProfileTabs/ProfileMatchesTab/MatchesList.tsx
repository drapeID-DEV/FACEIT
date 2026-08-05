'use client';
import { useGetMatchesHistoryQuery } from '@/store/api/playerApi';
import { MatchHistoryItem } from './MatchHistoryItem';

interface Props {
	nickname: string;
}

export function MatchesList({ nickname }: Props) {
	const { data, isLoading } = useGetMatchesHistoryQuery(nickname);

	if (!data?.length) {
		return (
			<div className="flex flex-col gap-2">
				<p className="text-2xl text-widget">No recent matches</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<ul className="flex flex-col gap-2">
				{data?.map((item) => (
					<MatchHistoryItem key={item.matchId} historyItem={item} />
				))}
			</ul>
		</div>
	);
}
