'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

import { socket } from '@/shared/lib/socket';

export function SocketProvider({ children }: PropsWithChildren) {
	const router = useRouter();

	useEffect(() => {
		const onMatchFound = (match: any) => {
			router.push(`/match/${match.id}`);
		};

		socket.on('matchFound', onMatchFound);

		socket.connect();

		return () => {
			socket.off('matchFound', onMatchFound);
			socket.disconnect();
		};
	}, [router]);

	return children;
}
