import Link from 'next/link';
import { MatchResultStrip } from './MatchResultStrip';
import { IMatchHistoryItem } from '@/shared/types/match-history';
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
			<div
				className={`w-full relative flex rounded-xl bg-primary hover:bg-accent hover:cursor-pointer duration-200 overflow-hidden`}
			>
				<MatchResultStrip isWinner={historyItem.isWinner} />
				<div className="grid w-full grid-cols-[1.3fr_1fr_1fr_1fr_.8fr] items-center gap-8 px-5 py-4">
					<MatchDate finishedAt={historyItem.match.finishedAt} />
					<MatchScore matchItem={historyItem} />
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
			</div>
		</Link>
	);
}
