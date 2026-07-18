import { MatchResultBadge } from '@/shared/components/ui/MatchResultBadge';
import { getEnemyTeamName } from '@/shared/lib/enemy-teamname';
import { IMatchHistoryItem } from '@/shared/types/match-history';
import Link from 'next/link';

interface Props {
	matchItem: IMatchHistoryItem;
}

export function PopupMatchCard({ matchItem }: Props) {
	return (
		<Link
			href={`/match/${matchItem.matchId}`}
			className="bg-accent p-3 flex justify-between items-center w-full rounded-xl hover:bg-neutral-700 duration-200"
		>
			<p className="text-sm">{getEnemyTeamName(matchItem)}</p>
			<MatchResultBadge isWinner={matchItem.isWinner} />
		</Link>
	);
}
