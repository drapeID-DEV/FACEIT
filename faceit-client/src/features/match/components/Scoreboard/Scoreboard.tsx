import { ILiveMatchStats, IMatch, IMatchParticipant, TSide } from '@/shared/types/match';

import { ScoreboardTeam } from './ScoreboardTeam';

interface Props {
	match: IMatch;
	team1: IMatchParticipant[];
	team2: IMatchParticipant[];
	team1Name: string;
	team2Name: string;
	liveStats: ILiveMatchStats | null;
}

function currentSide(liveStats: ILiveMatchStats | null, team: number): TSide | null {
	return liveStats?.players.find((player) => player.team === team && player.side)?.side ?? null;
}

export function Scoreboard({ match, team1, team2, team1Name, team2Name, liveStats }: Props) {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-4 py-6">
			<ScoreboardTeam
				name={team1Name}
				score={match.team1Score}
				players={team1}
				side={currentSide(liveStats, 1)}
				isWinner={match.winnerTeam === 1}
			/>
			<ScoreboardTeam
				name={team2Name}
				score={match.team2Score}
				players={team2}
				side={currentSide(liveStats, 2)}
				isWinner={match.winnerTeam === 2}
			/>
			{match.status === 'LIVE' && !liveStats?.isLive && (
				<p className="text-center text-sm text-zinc-500">
					Waiting for the match to go live on the server...
				</p>
			)}
		</div>
	);
}
