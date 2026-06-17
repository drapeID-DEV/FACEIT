import { LogOut } from 'lucide-react';
import { ACCOUNT_MENU, SUPPORT_MENU } from '@/config/popupMenu.config';
import { AvatarBtn } from '../../../../shared/components/ui/AvatarBtn';
import { MenuDevider } from '@/shared/components/ui/MenuDevider';
import { Menu } from '../../../menu-system/components/Menu';

export function AccountPopup() {
	return (
		<>
			<div className="flex justify-between items-center p-4">
				<div className="flex gap-2 items-center">
					<AvatarBtn />
					<p className="text-xl">nickname</p>
				</div>
			</div>
			<MenuDevider />
			<Menu menuItems={ACCOUNT_MENU} />
			<MenuDevider />
			<Menu menuItems={SUPPORT_MENU} />
			<div className="absolute bottom-4 w-full">
				<MenuDevider />
				<button className="flex items-center gap-3 mx-4 px-4 py-2 hover:bg-accent duration-300 rounded-xl text-neutral-400">
					<LogOut size={24} />
					<p className="text-xl">Logout</p>
				</button>
			</div>
		</>
	);
}
