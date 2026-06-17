import { configureStore } from '@reduxjs/toolkit';
import sidebarSlice from './slices/SidebarStateSlice';
import { api } from './api/baseApi';

export const store = configureStore({
	reducer: {
		sidebar: sidebarSlice.reducer,
		[api.reducerPath]: api.reducer
	},
	middleware: (gDM) => gDM().concat(api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
