'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { socket } from '@/shared/lib/socket';
import { api } from '@/store/api/baseApi';
import { AppDispatch } from '@/store/store';
import { matchmakingApi } from '@/store/api/matchmakingApi';
import { IMapBanState } from '@/shared/types/api/responses';
import { matchApi } from '@/store/api/matchApi';

export function SocketProvider({ children }: PropsWithChildren) {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const invalidate = (...tags: ('Queue' | 'CurrentMatch')[]) =>
			dispatch(api.util.invalidateTags(tags));

		const onMatchReady = () => {
			invalidate('Queue');
		};

		const onAcceptedUpdated = (data: {
			acceptedPlayers: number;
			totalPlayers: number;
		}) => {
			dispatch(
				matchmakingApi.util.updateQueryData(
					'getCurrentAcceptance',
					undefined,
					(draft) => {
						if (!draft.hasAcceptance) {
							return;
						}

						draft.acceptance.acceptedPlayers = data.acceptedPlayers;
						draft.acceptance.totalPlayers = data.totalPlayers;
					}
				)
			);
		};

		const onMatchCancelled = () => {
			invalidate('Queue');
		};

		const onMatchCreated = (match: { id: string }) => {
			invalidate('Queue', 'CurrentMatch');

			router.push(`/match/${match.id}`);
		};

		socket.on('matchReady', onMatchReady);
		socket.on('acceptedUpdated', onAcceptedUpdated);
		socket.on('matchCancelled', onMatchCancelled);
		socket.on('matchCreated', onMatchCreated);

		socket.connect();

		return () => {
			socket.off('matchReady', onMatchReady);
			socket.off('acceptedUpdated', onAcceptedUpdated);
			socket.off('matchCancelled', onMatchCancelled);
			socket.off('matchCreated', onMatchCreated);

			socket.disconnect();
		};
	}, [dispatch, router]);

	return children;
}
