import { configureStore } from "@reduxjs/toolkit";
import formOptionsReducer from "./FormOptionsSlice";

export const store = configureStore({
  reducer: {
    formOptions: formOptionsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;