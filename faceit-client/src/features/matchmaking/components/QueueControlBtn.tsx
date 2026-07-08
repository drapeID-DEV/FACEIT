'use client';

import { WidgetBtn } from '@/shared/components/ui/WidgetBtn';
import {
	useGetCurrentMatchQuery,
	useGetQueueStatusQuery
} from '@/store/api/matchmakingApi';
import { JoinQueueBtn } from './JoinQueueBtn';
import { LeaveQueueBtn } from './LeaveQueueBtn';

export function QueueControlBtn() {
	const { data: currentMatch, isLoading } = useGetCurrentMatchQuery();
	const { data: queue } = useGetQueueStatusQuery();

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

	return <JoinQueueBtn matchType="ONE_VS_ONE" />;

	// <button onClick={handleOnPlay}>Play</button>;
}
