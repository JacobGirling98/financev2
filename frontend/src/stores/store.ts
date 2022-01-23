import { configureStore } from "@reduxjs/toolkit";
import formOptionsReducer from "./FormOptionsSlice";
import viewMoneyReducer from "./ViewMoneySlice";

export const store = configureStore({
  reducer: {
    formOptions: formOptionsReducer,
    viewMoney: viewMoneyReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;