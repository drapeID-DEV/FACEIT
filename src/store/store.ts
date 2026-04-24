import { configureStore } from "@reduxjs/toolkit";
import sidebarSlice from "./slices/SidebarStateSlice";

export const store = configureStore({
    reducer: {
        sidebar: sidebarSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;