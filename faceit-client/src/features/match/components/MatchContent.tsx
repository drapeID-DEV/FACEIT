'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { notification } from '@/shared/utils/notifications';

import { TeamList } from './TeamList';
import { MapBanScreen } from './MapBan/MapBanScreen';
import { SelectedMapScreen } from './SelectedMapScreen';
import { useMatch } from '../hooks/useMatch';
import { useMatchSocket } from '../hooks/useMatchSocket';

interface Props {
	matchId: string;
}

export function MatchContent({ matchId }: Props) {
	const router = useRouter();

	const {
		match,
		mapBan,
		team1,
		team2,
		team1Leader,
		team2Leader,
		isMyTurn,
		isParticipant,
		isError,
		isLoading
	} = useMatch(matchId);

	useMatchSocket(matchId);

	useEffect(() => {
		if (!isError) return;

		notification.info('Unable to load match data!');
		router.replace('/');
	}, [isError, router]);

	if (isLoading) {
		return null;
	}

	if (isError || !match) {
		return <h2>Something went wrong</h2>;
	}

	return (
		<div className="flex h-full items-center justify-center gap-8">
			<TeamList team={team1} />
			{mapBan?.status === 'MAP_BAN' && team1Leader && team2Leader && (
				<MapBanScreen
					team1Leader={team1Leader}
					team2Leader={team2Leader}
					matchId={matchId}
					state={mapBan}
					isMyTurn={isMyTurn}
				/>
			)}
			{mapBan?.selectedMap && (
				<SelectedMapScreen
					map={mapBan.selectedMap}
					isParticipiant={isParticipant}
				/>
			)}
			<TeamList team={team2} />
		</div>
	);
}
