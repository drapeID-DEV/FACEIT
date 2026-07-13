import { WidgetBtn } from '@/shared/components/ui/WidgetBtn';
import { TApiError } from '@/shared/types/api/responses';
import { notification } from '@/shared/utils/notifications';
import { useLeaveQueueMutation } from '@/store/api/matchmakingApi';
import { QueueTimer } from './QueueTimer';

interface Props {
	joinedAt: string;
}

export function LeaveQueueBtn({ joinedAt }: Props) {
	const [leaveQueue] = useLeaveQueueMutation();

	const handleLeaveQueue = async () => {
		try {
			const response = await leaveQueue().unwrap();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<WidgetBtn
			className="!bg-blue-600"
			title="Cancel"
			onClick={handleLeaveQueue}
		>
			<QueueTimer joinedAt={joinedAt} />
		</WidgetBtn>
	);
}
