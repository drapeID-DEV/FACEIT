'use client'

import { closePopupMenu } from '@/store/slices/SidebarStateSlice'
import { AppDispatch } from '@/store/store'
import { X } from 'lucide-react'
import { useDispatch } from 'react-redux'

export function ClosePopupBtn() {
	const dispatch = useDispatch<AppDispatch>()

	return (
		<button onClick={() => dispatch(closePopupMenu())}>
			<X size={24} color="#A1A1A1" />
		</button>
	)
}
