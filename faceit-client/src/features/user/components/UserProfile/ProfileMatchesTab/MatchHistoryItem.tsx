import Link from 'next/link';
import { MatchResultStrip } from './MatchResultStrip';
import { IMatchHistoryItem } from '@/shared/types/match-history';
import { MATCH_HISTORY_GRID } from './constants/grid';
import { MatchDate } from './MatchDate';
import { MatchScore } from './MatchScore';
import { MatchElo } from './MatchElo';
import { MatchKDA } from './MatchKDA';
import { MatchMap } from './MatchMap';

interface Props {
	historyItem: IMatchHistoryItem;
}

export function MatchHistoryItem({ historyItem }: Props) {
	return (
		<Link
			href={`/match/${historyItem.matchId}`}
			className="flex gap-3 text-sm w-full"
		>
			<MatchResultStrip isWinner={historyItem.isWinner} />
			<div
				className={`w-full flex justify-between items-center rounded-xl bg-primary px-5 py-4 hover:bg-accent hover:cursor-pointer duration-200`}
			>
				<MatchDate finishedAt={historyItem.match.finishedAt} />
				<MatchScore match={historyItem} />
				<MatchElo
					before={historyItem.eloBefore}
					after={historyItem.eloAfter}
				/>
				<MatchKDA
					kills={historyItem.kills}
					deaths={historyItem.deaths}
					assists={historyItem.assists}
				/>
				<MatchMap />
			</div>
		</Link>
	);
}
