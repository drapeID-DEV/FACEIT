import { IMatchHistoryItem } from '@/shared/types/match-history';
import { PopupMatchCard } from './PopupMatchCard';

interface Props {
	matches: IMatchHistoryItem[] | undefined;
}

export function PopupMatchesList({ matches }: Props) {
	if (!matches) {
		return <p className="text-sm text-center">Unable to load matches</p>;
	}

	return (
		<ul className="flex flex-col gap-3 px-5 mb-3 overflow-y-auto">
			{matches.map((item) => (
				<PopupMatchCard key={item.matchId} matchItem={item} />
			))}
		</ul>
	);
}
