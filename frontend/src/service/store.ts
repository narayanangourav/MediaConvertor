import { configureStore } from "@reduxjs/toolkit";
import mediaReducer from "./mediaSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
