'use client';

import { useGetMapBanStateQuery, useGetMatchQuery } from '@/store/api/matchApi';
import { useGetMeQuery } from '@/store/api/userApi';

export function useMatch(matchId: string) {
	const { data: match, isError, isLoading } = useGetMatchQuery(matchId);
	const { data: mapBan } = useGetMapBanStateQuery(matchId);
	const { data: me } = useGetMeQuery();

	const team1 = match?.participants.filter((player) => player.team === 1);
	const team2 = match?.participants.filter((player) => player.team === 2);

	const currentLeaderId =
		mapBan?.currentBanTurn === 'TEAM1'
			? mapBan.team1LeaderId
			: mapBan?.team2LeaderId;

	const isMyTurn = currentLeaderId === me?.id;

	const isParticipant =
		match?.participants.some((player) => player.user.id === me?.id) ??
		false;

	const team1Leader = match?.participants.find(
		(player) => player.user.id === mapBan?.team1LeaderId
	);

	const team2Leader = match?.participants.find(
		(player) => player.user.id === mapBan?.team2LeaderId
	);

	return {
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
	};
}
