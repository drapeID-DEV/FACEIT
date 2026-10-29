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
		// Fills the available height; map cards share it so nothing scrolls
		<div className="flex h-full min-h-0 w-100 flex-col gap-3 self-stretch py-3">
			<div className="flex shrink-0 items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
						Currently banning
					</p>
					<h2 className="mt-1 text-xl font-bold text-white">
						team_{currentLeader.user.nickname}
					</h2>
				</div>
				<MapBanTimer key={state.banDeadline} deadline={state.banDeadline!} />
			</div>
			<div className="flex min-h-0 flex-1 flex-col gap-2">
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
