'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { socket } from '@/shared/lib/socket';
import { AppDispatch } from '@/store/store';
import {
	acceptedUpdated,
	matchReady,
	resetMatchmaking
} from '@/store/slices/AcceptancePopupSlice';
import { api } from '@/store/api/baseApi';

export function SocketProvider({ children }: PropsWithChildren) {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const onMatchReady = (data: {
			acceptanceId: string;
			expiresAt: string;
			acceptedPlayers: number;
			totalPlayers: number;
		}) => {
			dispatch(matchReady(data));
		};

		const onAcceptedUpdated = (data: {
			acceptedPlayers: number;
			totalPlayers: number;
		}) => {
			dispatch(acceptedUpdated(data));
		};

		const onMatchCancelled = () => {
			dispatch(resetMatchmaking());
		};

		const onMatchCreated = (match: { id: string }) => {
			dispatch(resetMatchmaking());

			dispatch(api.util.invalidateTags(['Queue', 'CurrentMatch']));

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
