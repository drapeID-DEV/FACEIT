'use client';

import { POPUP_MENU } from '@/config/rightsideMenu.config';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setActiveItem } from '@/store/slices/SidebarStateSlice';
import { AvatarBtn } from '../../../../shared/components/ui/AvatarBtn';
import { PopupButton } from './PopupButton';
import { useGetMeQuery } from '@/store/api/userApi';

interface Props {}

export function RightSidebar({}: Props) {
	const dispatch = useDispatch<AppDispatch>();
	const { data } = useGetMeQuery();

	return (
		<aside className="w-19 h-full bg-primary py-2">
			<nav className="flex flex-col items-center gap-4">
				<AvatarBtn
					nickname={data?.nickname}
					onClick={() => dispatch(setActiveItem('account'))}
				/>
				{POPUP_MENU.map((element) => (
					<PopupButton key={element.title} popupBtn={element} />
				))}
			</nav>
		</aside>
	);
}
