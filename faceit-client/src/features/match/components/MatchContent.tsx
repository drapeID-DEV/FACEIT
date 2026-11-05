'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { notification } from '@/shared/utils/notifications';

import { AdminMatchControls } from './AdminMatchControls';
import { TeamList } from './TeamList';
import { MapBanScreen } from './MapBan/MapBanScreen';
import { SelectedMapScreen } from './SelectedMapScreen';
import { MatchScoreHeader } from './MatchScoreHeader';
import { MatchTab, MatchTabs } from './MatchTabs';
import { Scoreboard } from './Scoreboard/Scoreboard';
import { useMatch } from '../hooks/useMatch';
import { useMatchSocket } from '../hooks/useMatchSocket';

interface Props {
	matchId: string;
}

export function MatchContent({ matchId }: Props) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<MatchTab>('overview');

	const {
		match,
		mapBan,
		me,
		team1,
		team2,
		team1Leader,
		team2Leader,
		isMyTurn,
		isParticipant,
		isError,
		isLoading
	} = useMatch(matchId);

	const { serverInfo, liveStats } = useMatchSocket(matchId);

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

	const team1Name = `team_${team1?.[0]?.user.nickname ?? '1'}`;
	const team2Name = `team_${team2?.[0]?.user.nickname ?? '2'}`;

	return (
		<div className="flex h-full flex-col">
			<MatchScoreHeader
				match={match}
				team1Name={team1Name}
				team2Name={team2Name}
				isLive={liveStats?.isLive ?? false}
				round={liveStats?.isLive ? liveStats.round : null}
			/>
			{me?.role === 'ADMIN' && (
				<AdminMatchControls
					match={match}
					team1Name={team1Name}
					team2Name={team2Name}
				/>
			)}
			<MatchTabs activeTab={activeTab} onChange={setActiveTab} />

			{activeTab === 'overview' ? (
				<div className="flex min-h-0 flex-1 items-center justify-center gap-8">
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
							isParticipiant={isParticipant && match.status === 'LIVE'}
							serverInfo={serverInfo}
						/>
					)}
					<TeamList team={team2} />
				</div>
			) : (
				<Scoreboard
					match={match}
					team1={team1 ?? []}
					team2={team2 ?? []}
					team1Name={team1Name}
					team2Name={team2Name}
					liveStats={liveStats}
				/>
			)}
		</div>
	);
}
