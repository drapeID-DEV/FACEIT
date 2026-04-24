import { PopupType } from '@/config/popupMenu.config'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface sidebarState {
	isOpen: boolean
	activeItem: PopupType | null
}

const initialState: sidebarState = {
	isOpen: false,
	activeItem: null
}

const sidebarSlice = createSlice({
	name: 'cities',
	initialState,
	reducers: {
		setActiveItem(state, action: PayloadAction<PopupType>) {
			if (action.payload == state.activeItem) {
				state.activeItem = null
				state.isOpen = false
				return
			}
			state.activeItem = action.payload
			state.isOpen = true
		},
		closePopupMenu(state) {
			state.activeItem = null
			state.isOpen = false
		}
	}
})

export default sidebarSlice
export const { setActiveItem, closePopupMenu } = sidebarSlice.actions
