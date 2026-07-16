import { IMatchHistoryItem } from '@/shared/types/match-history';

interface Props {
	match: IMatchHistoryItem;
}

export function MatchScore({ match }: Props) {
	const { team1Score, team2Score } = match.match;

	return (
		<div className="flex items-center gap-3">
			<div
				className={`w-6 h-6 rounded font-bold text-xs flex items-center justify-center ${
					match.isWinner ? 'bg-green-500' : 'bg-red-500'
				}`}
			>
				{match.isWinner ? 'W' : 'L'}
			</div>

			<p className="font-bold text-lg">
				{team1Score}
				<span className="mx-2 text-neutral-500">:</span>
				{team2Score}
			</p>
		</div>
	);
}
