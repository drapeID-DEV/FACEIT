'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ClosePopupBtn } from './ClosePopupBtn';
import { MenuDevider } from '@/shared/components/ui/MenuDevider';

export function PopupHeader() {
	const activePopup = useSelector(
		(state: RootState) => state.sidebar.activeItem
	);
	const title = activePopup
		? activePopup.charAt(0).toUpperCase() + activePopup.slice(1)
		: '';

	return (
		<>
			<div className="flex justify-between items-center p-4">
				<h2 className="text-xl">{title}</h2>
				<ClosePopupBtn />
			</div>
			<MenuDevider />
		</>
	);
}
