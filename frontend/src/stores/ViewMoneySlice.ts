import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { DateRange, DateRangesData, FinanceApiResponse, TimePeriod, TransactionsTableRow, ViewMoneyState, ViewMoneySummary } from "../types/types";
import { DATE_RANGES_URL, VIEW_MONEY_SUMMARY_URL, VIEW_MONEY_TRANSACTIONS_URL } from "../utils/api-urls";
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
  },
  transactions: {
    data: [],
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

export const fetchTransactionsByDate = createAsyncThunk("viewMoney/fetchViewMoneyTransactions", async (dates: {start: string, end: string}) => {
  const { start, end } = dates
  const response: FinanceApiResponse<TransactionsTableRow[]> = await axios.get(
    VIEW_MONEY_TRANSACTIONS_URL, { params: { start, end } }
  )
  console.log(response)
  return response.data
})

export const viewMoney = createSlice({
  name: "viewMoney",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSummaryByDate.pending, state => {
      state.summary.status = "loading";
    })
    builder.addCase(fetchSummaryByDate.fulfilled, (state, { payload }) => {
      state.summary.status = "succeeded";
      state.summary.data = payload;
    })
    builder.addCase(fetchTransactionsByDate.pending, state => {
      state.transactions.status = "loading";
    })
    builder.addCase(fetchTransactionsByDate.fulfilled, (state, { payload }) => {
      state.transactions.status = "succeeded";
      state.transactions.data = payload;
    })
  }
})

export default viewMoney.reducer;
export const { setDateRange } = viewMoney.actions;
export const viewMoneyDateRange = (state: RootState) => state.viewMoney.dateRange;
export const viewMoneySummary = (state: RootState) => state.viewMoney.summary;
export const viewMoneyTransactions = (state: RootState) => state.viewMoney.transactions;