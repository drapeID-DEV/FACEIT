'use client';
import { ACCOUNT_MENU, SUPPORT_MENU } from '@/config/popupMenu.config';
import { AvatarBtn } from '../../../../shared/components/ui/AvatarBtn';
import { MenuDevider } from '@/shared/components/ui/MenuDevider';
import { Menu } from '../../../menu-system/components/Menu';
import { LogoutBtn } from '@/shared/components/ui/LogoutBtn';
import { useGetMeQuery } from '@/store/api/userApi';
import { Loader } from '@/shared/components/ui/Loader';

export function AccountPopup() {
	const { data, isLoading } = useGetMeQuery();

	if (isLoading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<>
			<div className="flex justify-between items-center p-4">
				<div className="flex gap-2 items-center">
					<AvatarBtn isLink href={`/players/${data?.nickname}`} />
					<div className="flex flex-col">
						<p className="text-md">{data?.nickname}</p>
						<p className="text-sm text-widget font-bold">
							ELO: {data?.elo}
						</p>
					</div>
				</div>
			</div>
			<MenuDevider />
			<Menu menuItems={ACCOUNT_MENU} />
			<MenuDevider />
			<Menu menuItems={SUPPORT_MENU} />
			<div className="absolute bottom-4 w-full">
				<MenuDevider />
				<LogoutBtn />
			</div>
		</>
	);
}
