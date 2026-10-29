import { IMatch } from '@/shared/types/match';

interface Props {
	match: IMatch;
	team1Name: string;
	team2Name: string;
	isLive: boolean;
	round: number | null;
}

export function MatchScoreHeader({
	match,
	team1Name,
	team2Name,
	isLive,
	round
}: Props) {
	const isFinished = match.status === 'FINISHED';

	return (
		<div className="flex shrink-0 flex-col items-center gap-1 py-2">
			<div className="flex items-center gap-6 text-2xl font-bold">
				<span
					className={`w-48 truncate text-right ${match.winnerTeam === 1 ? 'text-widget' : 'text-white'}`}
				>
					{team1Name}
				</span>
				<span className="font-mono text-4xl text-white">
					{match.team1Score} : {match.team2Score}
				</span>
				<span
					className={`w-48 truncate ${match.winnerTeam === 2 ? 'text-widget' : 'text-white'}`}
				>
					{team2Name}
				</span>
			</div>
			<div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
				{isFinished ? (
					<span className="text-zinc-400">Finished</span>
				) : isLive ? (
					<>
						<span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
						<span className="text-red-400">Live</span>
						{round && (
							<span className="text-zinc-500">· Round {round}</span>
						)}
					</>
				) : (
					<span className="text-zinc-500">
						{match.status.replace('_', ' ')}
					</span>
				)}
			</div>
		</div>
	);
}
