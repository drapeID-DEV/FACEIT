'use client';

import { useGetMatchQuery } from '@/store/api/matchApi';
import { TeamList } from './TeamList';
import { useRouter } from 'next/navigation';
import { notification } from '@/shared/utils/notifications';
import { useEffect } from 'react';

interface Props {
	matchId: string;
}

export function MatchContent({ matchId }: Props) {
	const { data, isLoading, isError } = useGetMatchQuery(matchId);

	const router = useRouter();

	useEffect(() => {
		if (!isError) return;

		notification.info('Unable to load match data!');
		router.replace('/');
	}, [isError, router]);

	if (isError) {
		return null;
	}

	const team1 = data?.participants.filter((player) => player.team === 1);
	const team2 = data?.participants.filter((player) => player.team === 2);

	return (
		<div className="flex h-full items-center justify-center gap-8">
			<TeamList team={team1} />
			<h1 className="font-bold text-widget">VS</h1>
			<TeamList team={team2} />
		</div>
	);
}
