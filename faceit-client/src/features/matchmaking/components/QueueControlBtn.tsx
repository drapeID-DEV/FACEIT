'use client';

import { WidgetBtn } from '@/shared/components/ui/WidgetBtn';
import { TMatchType } from '@/shared/types/match';
import {
	useGetCurrentMatchQuery,
	useGetQueueStatusQuery
} from '@/store/api/matchmakingApi';
import { useGetPartyQuery } from '@/store/api/partyApi';
import { useGetMeQuery } from '@/store/api/userApi';
import { JoinQueueBtn } from './JoinQueueBtn';
import { LeaveQueueBtn } from './LeaveQueueBtn';

interface Props {
	matchType: TMatchType;
}

export function QueueControlBtn({ matchType }: Props) {
	const { data: me } = useGetMeQuery();
	const { data: currentMatch } = useGetCurrentMatchQuery();
	const { data: queue } = useGetQueueStatusQuery();
	const { data: partyState } = useGetPartyQuery();

	const party = partyState?.party;

	if (currentMatch?.hasActiveMatch) {
		return (
			<WidgetBtn
				isLink
				title="Match page"
				href={`/match/${currentMatch.match?.id}`}
			></WidgetBtn>
		);
	}

	if (queue?.inQueue) {
		return <LeaveQueueBtn joinedAt={queue.joinedAt} />;
	}

	if (party && party.members.length > 1 && party.leaderId !== me?.id) {
		return (
			<p className="py-2 text-neutral-400">
				Waiting for the party leader to start the queue...
			</p>
		);
	}

	return <JoinQueueBtn matchType={matchType} />;
}
