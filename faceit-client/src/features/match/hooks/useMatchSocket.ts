'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { socket } from '@/shared/lib/socket';
import { IMapBanState } from '@/shared/types/api/responses';
import { ILiveMatchStats } from '@/shared/types/match';
import { matchApi } from '@/store/api/matchApi';
import { AppDispatch } from '@/store/store';

export type ServerStatus = 'STARTING' | 'READY' | 'FAILED';

export interface ServerInfo {
	status: ServerStatus;
	address: string | null;
	map: string;
	error?: string;
}

export function useMatchSocket(matchId: string) {
	const dispatch = useDispatch<AppDispatch>();
	const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
	const [liveStats, setLiveStats] = useState<ILiveMatchStats | null>(null);

	useEffect(() => {
		// Rooms are lost on reconnect, so join again on every connect
		const joinMatch = () => socket.emit('joinMatch', { matchId });

		const handleMapBanUpdated = (state: IMapBanState) => {
			dispatch(
				matchApi.util.updateQueryData(
					'getMapBanState',
					matchId,
					(draft) => {
						Object.assign(draft, state);
					}
				)
			);

			// Keep the match in sync too, otherwise LIVE-only UI (server IP) waits for a reload
			dispatch(
				matchApi.util.updateQueryData('getMatch', matchId, (draft) => {
					draft.status = state.status;
					draft.selectedMap = state.selectedMap;
				})
			);
		};

		const handleServerStatus = (data: ServerInfo) => {
			setServerInfo(data);
		};

		// The cached match stays the single source of truth for scores and stats
		const handleLiveStats = (stats: ILiveMatchStats) => {
			setLiveStats(stats);

			dispatch(
				matchApi.util.updateQueryData('getMatch', matchId, (draft) => {
					draft.team1Score = stats.team1Score;
					draft.team2Score = stats.team2Score;

					for (const player of stats.players) {
						const participant = draft.participants.find(
							(p) => p.userId === player.userId
						);

						if (!participant) continue;

						participant.kills = player.kills;
						participant.deaths = player.deaths;
						participant.assists = player.assists;
						participant.headshots = player.headshots;
					}
				})
			);
		};

		const handleMatchFinished = () => {
			setLiveStats(null);
			dispatch(
				matchApi.endpoints.getMatch.initiate(matchId, {
					subscribe: false,
					forceRefetch: true
				})
			);
		};

		socket.on('connect', joinMatch);
		socket.on('mapBanUpdated', handleMapBanUpdated);
		socket.on('serverStatus', handleServerStatus);
		socket.on('liveStats', handleLiveStats);
		socket.on('matchFinished', handleMatchFinished);

		if (socket.connected) {
			joinMatch();
		} else {
			socket.connect();
		}

		return () => {
			socket.off('connect', joinMatch);
			socket.off('mapBanUpdated', handleMapBanUpdated);
			socket.off('serverStatus', handleServerStatus);
			socket.off('liveStats', handleLiveStats);
			socket.off('matchFinished', handleMatchFinished);
		};
	}, [dispatch, matchId]);

	return { serverInfo, liveStats };
}
