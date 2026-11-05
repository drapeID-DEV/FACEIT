import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

import { WidgetBtn } from '@/shared/components/ui/WidgetBtn';
import { TApiError } from '@/shared/types/api/responses';
import { TMatchType } from '@/shared/types/match';
import { notification } from '@/shared/utils/notifications';
import { useJoinQueueMutation } from '@/store/api/matchmakingApi';
import { useGetMeQuery } from '@/store/api/userApi';

interface Props {
	matchType: TMatchType;
}

export function JoinQueueBtn({ matchType }: Props) {
	const [joinQueue] = useJoinQueueMutation();
	const { data: me, isLoading } = useGetMeQuery();

	// Live match stats are matched by SteamID, the server enforces this too
	const hasSteam = !!me?.steamId;
	const isBanned = !!me?.isBanned;

	const handleJoinQueue = async () => {
		try {
			await joinQueue({
				matchType
			}).unwrap();
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<WidgetBtn
				title="Find match"
				onClick={handleJoinQueue}
				disabled={isLoading || !hasSteam || isBanned}
			></WidgetBtn>
			{isBanned && (
				<div className="flex max-w-md items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
					<TriangleAlert className="mt-0.5 shrink-0" size={18} />
					<p>Your account is banned from matchmaking.</p>
				</div>
			)}
			{!isLoading && !isBanned && !hasSteam && (
				<div className="flex max-w-md items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
					<TriangleAlert className="mt-0.5 shrink-0" size={18} />
					<p>
						You need to link your Steam account before playing.{' '}
						<Link
							href="/settings/account"
							className="font-semibold text-white underline hover:text-widget"
						>
							Link Steam in account settings
						</Link>
					</p>
				</div>
			)}
		</div>
	);
}
