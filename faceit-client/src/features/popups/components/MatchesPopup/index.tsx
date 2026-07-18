import { useGetMeQuery } from '@/store/api/userApi';
import { PopupMatchesList } from './PopupMatchesList';
import { useGetMatchesHistoryQuery } from '@/store/api/matchApi';
import { notification } from '@/shared/utils/notifications';
import { TApiError } from '@/shared/types/api/responses';
import { Loader } from '@/shared/components/ui/Loader';

export function MatchesPopup() {
	const { data: user, isLoading: userLoad, error: userErr } = useGetMeQuery();

	if (!user) {
		const err = userErr as TApiError;
		notification.info(err.data.message);
		return <p>User not found</p>;
	}

	const { data: matches, isLoading: matchesLoad } = useGetMatchesHistoryQuery(
		user.nickname
	);

	if (userLoad || matchesLoad) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return <PopupMatchesList matches={matches} />;
}
