import { MATCH_MAPS } from '@/config/maps.config';
import { socket } from '@/shared/lib/socket';
import { IMapBanState } from '@/shared/types/api/responses';
import { MapCard } from './MapCard/MapCard';
import { MapBanTimer } from './MapBanTimer';
import { SelectedMapScreen } from '../SelectedMapScreen';

interface Props {
	matchId: string;
	state: IMapBanState;
	isMyTurn: boolean;
}

export function MapBan({ matchId, state, isMyTurn }: Props) {
	return (
		<div className="flex flex-col gap-8">
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
