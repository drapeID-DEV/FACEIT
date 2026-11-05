import { skipToken } from '@reduxjs/toolkit/query';
import { useGetMeQuery } from '@/store/api/userApi';
import { PopupMatchesList } from './PopupMatchesList';
import { Loader } from '@/shared/components/ui/Loader';
import { useGetMatchesHistoryQuery } from '@/store/api/playerApi';

export function MatchesPopup() {
	const { data: user, isLoading: userLoad } = useGetMeQuery();

	const { data: matches, isLoading: matchesLoad } = useGetMatchesHistoryQuery(
		user?.nickname ?? skipToken
	);

	if (userLoad || matchesLoad) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!user) {
		return <p className="text-sm text-center">User not found</p>;
	}

	return <PopupMatchesList matches={matches} />;
}
