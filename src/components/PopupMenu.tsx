'use client'

import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { POPUPS } from '@/config/popupMenu.config'

interface Props {}

export function PopupMenu({}: Props) {
	const isOpen = useSelector((state: RootState) => state.sidebar.isOpen)
	const activeItem = useSelector(
		(state: RootState) => state.sidebar.activeItem
	)

	const ActivePopup = activeItem ? POPUPS[activeItem] : null

	return (
		<>
			{isOpen && ActivePopup && (
				<div className="h-full border border-neutral-700 w-70 bg-neutral-900 absolute right-3 rounded-xl">
					<div className="flex flex-col relative h-full">
						<ActivePopup />
					</div>
				</div>
			)}
		</>
	)
}
