import { WidgetBtn } from '@/shared/components/ui/WidgetBtn';
import { TApiError } from '@/shared/types/api/responses';
import { TMatchType } from '@/shared/types/match';
import { notification } from '@/shared/utils/notifications';
import { useJoinQueueMutation } from '@/store/api/matchmakingApi';

interface Props {
	matchType: TMatchType;
}

export function JoinQueueBtn({ matchType }: Props) {
	const [joinQueue] = useJoinQueueMutation();

	const handleJoinQueue = async () => {
		try {
			const response = await joinQueue({
				matchType
			}).unwrap();

			if (response.message) notification.info(response.message);
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return <WidgetBtn title="Play" onClick={handleJoinQueue}></WidgetBtn>;
}
