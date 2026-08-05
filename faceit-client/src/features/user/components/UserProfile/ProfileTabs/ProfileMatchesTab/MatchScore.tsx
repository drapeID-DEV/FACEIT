import { MatchResultBadge } from '@/shared/components/ui/MatchResultBadge';
import { IEloHistoryItem } from '@/shared/types/api/responses';
import { IMatchHistoryItem } from '@/shared/types/match-history';

interface Props {
	matchItem: IMatchHistoryItem | IEloHistoryItem;
}

export function MatchScore({ matchItem }: Props) {
	const { team1Score, team2Score } = matchItem.match;

	const userTeamScore = matchItem.team === 1 ? team1Score : team2Score;
	const opponentTeamScore = matchItem.team === 1 ? team2Score : team1Score;

	return (
		<div className="flex items-center gap-3">
			<MatchResultBadge isWinner={matchItem.isWinner} />
			<div className="flex font-bold text-lg">
				<p
					className={`${matchItem.isWinner ? 'text-green-500' : 'text-red-500'}`}
				>
					{userTeamScore}
				</p>
				<span className="mx-2 text-neutral-500">:</span>
				<p>{opponentTeamScore}</p>
			</div>
		</div>
	);
}
