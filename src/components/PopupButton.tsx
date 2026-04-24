'use client'

import { ICONS } from '@/config/icons.config'
import { IWidgetBtn } from '@/shared/types/widgets'
import { setActiveItem } from '@/store/slices/SidebarStateSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'

interface Props {
	popupBtn: IWidgetBtn
}

export function PopupButton({ popupBtn }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const activeItem = useSelector(
		(state: RootState) => state.sidebar.activeItem
	)

	const isActive = activeItem == popupBtn.title
	const Icon = ICONS[popupBtn.icon]

	return (
		<button
			onClick={() => dispatch(setActiveItem(popupBtn.title))}
			className={`hover:cursor-pointer p-2.5 hover:bg-neutral-800 rounded-xl duration-300 ${isActive ? 'bg-neutral-700' : ''}`}
		>
			<Icon size={25} color={isActive ? '#FFF' : '#A1A1A1'} />
		</button>
	)
}
