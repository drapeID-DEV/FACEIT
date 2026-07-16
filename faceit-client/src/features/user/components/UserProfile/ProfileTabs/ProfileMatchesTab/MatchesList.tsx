'use client';
import { useGetMatchesHistoryQuery } from '@/store/api/matchApi';
import { MatchHistoryItem } from './MatchHistoryItem';

interface Props {
	nickname: string;
}

export function MatchesList({ nickname }: Props) {
	const { data, isLoading } = useGetMatchesHistoryQuery(nickname);

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
