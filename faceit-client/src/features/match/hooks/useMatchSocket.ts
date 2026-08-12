'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { socket } from '@/shared/lib/socket';
import { IMapBanState } from '@/shared/types/api/responses';
import { matchApi } from '@/store/api/matchApi';
import { AppDispatch } from '@/store/store';

export function useMatchSocket(matchId: string) {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		socket.emit('joinMatch', {
			matchId
		});

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
		};

		socket.on('mapBanUpdated', handleMapBanUpdated);

		return () => {
			socket.off('mapBanUpdated', handleMapBanUpdated);
		};
	}, [dispatch, matchId]);
}
