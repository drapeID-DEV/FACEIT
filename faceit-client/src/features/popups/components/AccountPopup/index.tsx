'use client';
import { ACCOUNT_MENU, SUPPORT_MENU } from '@/config/popupMenu.config';
import { AvatarBtn } from '../../../../shared/components/ui/AvatarBtn';
import { MenuDevider } from '@/shared/components/ui/MenuDevider';
import { Menu } from '../../../menu-system/components/Menu';
import { LogoutBtn } from '@/shared/components/ui/LogoutBtn';
import { useGetMeQuery } from '@/store/api/userApi';

export function AccountPopup() {
	const { data, isLoading } = useGetMeQuery();

	return (
		<>
			<div className="flex justify-between items-center p-4">
				<div className="flex gap-2 items-center">
					<AvatarBtn isLink href={`/players/${data?.nickname}`} />
					<p className="text-xl">{data?.nickname}</p>
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
