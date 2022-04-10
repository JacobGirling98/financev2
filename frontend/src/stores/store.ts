import { configureStore } from "@reduxjs/toolkit";
import viewMoneyReducer from "./ViewMoneySlice";

export const store = configureStore({
  reducer: {
    viewMoney: viewMoneyReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;