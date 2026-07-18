import { MatchResultBadge } from '@/shared/components/ui/MatchResultBadge';
import { IMatchHistoryItem } from '@/shared/types/match-history';

interface Props {
	matchItem: IMatchHistoryItem;
}

export function MatchScore({ matchItem }: Props) {
	const { team1Score, team2Score } = matchItem.match;

	return (
		<div className="flex items-center gap-3">
			<MatchResultBadge isWinner={matchItem.isWinner} />
			<p className="font-bold text-lg">
				{team1Score}
				<span className="mx-2 text-neutral-500">:</span>
				{team2Score}
			</p>
		</div>
	);
}
