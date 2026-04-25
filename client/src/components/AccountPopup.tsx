import { LogOut } from 'lucide-react'
import { Menu } from './Menu'
import { ACCOUNT_MENU, SUPPORT_MENU } from '@/config/popupMenu.config'
import { ClosePopupBtn } from './ClosePopupBtn'
import { AvatarBtn } from './AvatarBtn'

export function AccountPopup() {
	return (
		<>
			<div className="flex justify-between items-center p-4">
				<div className="flex gap-2 items-center">
					<AvatarBtn />
					<p className="text-xl">nickname</p>
				</div>
				<ClosePopupBtn />
			</div>
			<div className="h-0.5 bg-neutral-800 mb-4"></div>
			<Menu menuItems={ACCOUNT_MENU} />
			<div className="h-0.5 bg-neutral-800 my-4"></div>
			<Menu menuItems={SUPPORT_MENU} />
			<div className="absolute bottom-4 w-full">
				<div className="h-0.5 bg-neutral-800 my-4"></div>
				<button className="flex items-center gap-3 mx-4 px-4 py-2 hover:bg-neutral-800 duration-300 rounded-xl text-neutral-400">
					<LogOut size={24} />
					<p className="text-xl">Logout</p>
				</button>
			</div>
		</>
	)
}
