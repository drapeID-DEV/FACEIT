import { IMatchParticipant } from '@/shared/types/match';
import { PlayerMatchCard } from './MatchCard/PlayerMatchCard';

interface Props {
	team?: IMatchParticipant[];
}

export function TeamList({ team }: Props) {
	if (!team || team.length === 0) {
		return (
			<div className="flex h-40 w-64 items-center justify-center rounded-xl border border-neutral-700 text-neutral-500">
				No players
			</div>
		);
	}

	return (
		<ul className="w-full max-w-80 m-0 p-0 list-none">
			{team?.map((participiant) => (
				<PlayerMatchCard player={participiant}></PlayerMatchCard>
			))}
		</ul>
	);
}
