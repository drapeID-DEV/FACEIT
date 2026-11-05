'use client';

import { ICONS } from '@/config/icons.config';
import { PopupType } from '@/config/popupMenu.config';
import { IWidgetBtn } from '@/shared/types/widgets';
import { setActiveItem } from '@/store/slices/SidebarStateSlice';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
	popupBtn: IWidgetBtn;
	badge?: number;
}

export function PopupButton({ popupBtn, badge = 0 }: Props) {
	const dispatch = useDispatch<AppDispatch>();
	const activeItem = useSelector(
		(state: RootState) => state.sidebar.activeItem
	);

	const isActive = activeItem == popupBtn.title;
	const Icon = ICONS[popupBtn.icon];

	return (
		<button
			data-popup-trigger
			onClick={() => dispatch(setActiveItem(popupBtn.title as PopupType))}
			className={`relative hover:cursor-pointer p-2.5 hover:bg-accent rounded-xl duration-300 ${isActive ? 'bg-neutral-700' : ''}`}
		>
			<Icon size={25} color={isActive ? '#FFF' : '#A1A1A1'} />
			{badge > 0 && (
				<span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-widget px-1 text-xs font-bold text-white">
					{badge > 99 ? '99+' : badge}
				</span>
			)}
		</button>
	);
}
