'use client';

import {
	IPlayerProfileRes,
	TApiError
} from '@/shared/types/api/responses';
import { notification } from '@/shared/utils/notifications';
import {
	useGetMeQuery,
	useUpdateUserBanMutation,
	useUpdateUserRoleMutation
} from '@/store/api/userApi';

interface Props {
	userData: IPlayerProfileRes;
}

const buttonClassName =
	'w-full box-border rounded-[14px] border border-accent px-4 py-2 text-xl font-bold transition hover:bg-accent hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';

export function AdminUserControls({ userData }: Props) {
	const { data: me } = useGetMeQuery();

	const [updateRole, { isLoading: isUpdatingRole }] =
		useUpdateUserRoleMutation();
	const [updateBan, { isLoading: isUpdatingBan }] =
		useUpdateUserBanMutation();

	if (me?.role !== 'ADMIN' || me.id === userData.id) {
		return null;
	}

	const { id, nickname, isBanned } = userData;
	const isAdmin = userData.role === 'ADMIN';
	const isLoading = isUpdatingRole || isUpdatingBan;

	const handleRole = async () => {
		const message = isAdmin
			? `Remove admin rights from ${nickname}?`
			: `Promote ${nickname} to admin?`;

		if (!window.confirm(message)) {
			return;
		}

		try {
			await updateRole({
				id,
				role: isAdmin ? 'REGULAR' : 'ADMIN'
			}).unwrap();
			notification.info(
				isAdmin ? 'Admin rights removed!' : 'User promoted!'
			);
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	const handleBan = async () => {
		const message = isBanned
			? `Unban ${nickname}?`
			: `Ban ${nickname} from matchmaking?`;

		if (!window.confirm(message)) {
			return;
		}

		try {
			await updateBan({ id, isBanned: !isBanned }).unwrap();
			notification.info(isBanned ? 'User unbanned!' : 'User banned!');
		} catch (error) {
			const err = error as TApiError;
			notification.error(err.data.message);
		}
	};

	return (
		<div className="flex w-full flex-col gap-3">
			{isBanned && (
				<p className="text-center text-sm font-bold text-red-500">
					Banned from matchmaking
				</p>
			)}
			{!isBanned && (
				<button
					type="button"
					className={`${buttonClassName} text-white`}
					disabled={isLoading}
					onClick={handleRole}
				>
					{isAdmin ? 'Remove admin' : 'Promote to admin'}
				</button>
			)}
			{!isAdmin && (
				<button
					type="button"
					className={`${buttonClassName} text-red-500`}
					disabled={isLoading}
					onClick={handleBan}
				>
					{isBanned ? 'Unban' : 'Ban'}
				</button>
			)}
		</div>
	);
}
