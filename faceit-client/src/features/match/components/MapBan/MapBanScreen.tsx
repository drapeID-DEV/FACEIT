import { MATCH_MAPS } from '@/config/maps.config';
import { socket } from '@/shared/lib/socket';
import { IMapBanState } from '@/shared/types/api/responses';
import { MapCard } from './MapCard/MapCard';
import { MapBanTimer } from './MapBanTimer';
import { IMatchParticipant } from '@/shared/types/match';

interface Props {
	team1Leader: IMatchParticipant;
	team2Leader: IMatchParticipant;
	matchId: string;
	state: IMapBanState;
	isMyTurn: boolean;
}

export function MapBanScreen({
	matchId,
	state,
	isMyTurn,
	team1Leader,
	team2Leader
}: Props) {
	const currentLeader =
		state.currentBanTurn === 'TEAM1' ? team1Leader : team2Leader;

	return (
		<div className="flex flex-col gap-8">
			<div className="text-center">
				<p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
					Currently banning
				</p>
				<h2 className="mt-1 text-xl font-bold text-white">
					team_{currentLeader.user.nickname}
				</h2>
			</div>
			<MapBanTimer deadline={state.banDeadline!} />
			<div className="flex flex-col gap-6 w-100">
				{MATCH_MAPS.map((map) => (
					<MapCard
						key={map}
						map={map}
						isAvailable={state.availableMaps.includes(map)}
						isMyTurn={isMyTurn}
						onBan={() =>
							socket.emit('banMap', {
								matchId,
								map
							})
						}
					/>
				))}
			</div>
		</div>
	);
}
