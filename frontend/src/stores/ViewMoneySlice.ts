import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { FinanceApiResponse, ViewMoneyState, ViewMoneySummary } from "../types/types";
import { VIEW_MONEY_SUMMARY_URL } from "../utils/api-urls";
import { RootState } from "./store";

const initialState: ViewMoneyState = {
  summary: {
    data: {
      income: 0,
      spending: 0,
      savings: 0,
      net: 0
    },
    status: "pending"
  }
}

export const fetchSummaryByDate = createAsyncThunk("viewMoney/fetchViewMoneySummary", async (dates: {start: string, end: string}) => {
  const { start, end } = dates
  const response: FinanceApiResponse<ViewMoneySummary> = await axios.get(
    VIEW_MONEY_SUMMARY_URL, { params: { start, end } }
  )
  return response.data
})

export const viewMoney = createSlice({
  name: "viewMoney",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSummaryByDate.pending, state => {
      state.summary.status = "loading";
    })
    builder.addCase(fetchSummaryByDate.fulfilled, (state, { payload }) => {
      state.summary.status = "succeeded";
      state.summary.data = payload
    })
  }
})

export default viewMoney.reducer;
export const viewMoneySummary = (state: RootState) => state.viewMoney.summary;