'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { POPUPS } from '@/config/popupMenu.config';
import { closePopupMenu } from '@/store/slices/SidebarStateSlice';
import { AppDispatch, RootState } from '@/store/store';

import { PopupHeader } from './PopupHeader';

export function PopupMenu() {
	const dispatch = useDispatch<AppDispatch>();

	const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);

	const activeItem = useSelector(
		(state: RootState) => state.sidebar.activeItem
	);

	const ActivePopup = activeItem ? POPUPS[activeItem] : null;

	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node)
			) {
				dispatch(closePopupMenu());
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dispatch, isOpen]);

	if (!isOpen || !ActivePopup) {
		return null;
	}

	return (
		<div
			ref={popupRef}
			className="absolute right-3 h-full w-70 rounded-xl border border-neutral-700 bg-primary"
		>
			<div className="relative flex h-full flex-col pt-4">
				<PopupHeader />
				<ActivePopup />
			</div>
		</div>
	);
}
