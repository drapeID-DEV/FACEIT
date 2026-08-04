'use client';

import {
	matchApi,
	useGetMapBanStateQuery,
	useGetMatchQuery
} from '@/store/api/matchApi';
import { TeamList } from './TeamList';
import { useRouter } from 'next/navigation';
import { notification } from '@/shared/utils/notifications';
import { useEffect } from 'react';
import { socket } from '@/shared/lib/socket';
import { IMapBanState } from '@/shared/types/api/responses';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { MapBan } from './MapBan/MapBan';
import { useGetMeQuery } from '@/store/api/userApi';
import { SelectedMapScreen } from './SelectedMapScreen';

interface Props {
	matchId: string;
}

export function MatchContent({ matchId }: Props) {
	const { data, isLoading, isError } = useGetMatchQuery(matchId);
	const { data: bansData } = useGetMapBanStateQuery(matchId);
	const { data: me } = useGetMeQuery();

	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	useEffect(() => {
		if (!isError) return;

		notification.info('Unable to load match data!');
		router.replace('/');
	}, [isError, router]);

	useEffect(() => {
		socket.emit('joinMatch', {
			matchId
		});
	}, [matchId]);

	useEffect(() => {
		const handler = (state: IMapBanState) => {
			console.log('mapBanUpdated', state);
			dispatch(
				matchApi.util.updateQueryData(
					'getMapBanState',
					matchId,
					(draft) => {
						Object.assign(draft, state);
					}
				)
			);
		};

		socket.on('mapBanUpdated', handler);

		return () => {
			socket.off('mapBanUpdated', handler);
		};
	}, [dispatch, matchId]);

	if (isError) {
		return null;
	}

	const team1 = data?.participants.filter((player) => player.team === 1);
	const team2 = data?.participants.filter((player) => player.team === 2);

	const currentLeaderId =
		bansData?.currentBanTurn === 'TEAM1'
			? bansData?.team1LeaderId
			: bansData?.team2LeaderId;

	const isMyTurn = currentLeaderId === me?.id;

	return (
		<div className="flex h-full items-center justify-center gap-8">
			<TeamList team={team1} />
			{bansData?.status === 'MAP_BAN' && (
				<MapBan
					isMyTurn={isMyTurn}
					matchId={matchId}
					state={bansData}
				/>
			)}
			{bansData?.selectedMap && (
				<SelectedMapScreen map={bansData?.selectedMap} />
			)}
			<TeamList team={team2} />
		</div>
	);
}
