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
  timePeriod: "Financial Months",
  dateRanges: {
    data: {
      financial_months: [],
      months:[],
      years: [],
      financial_years: []
    },
    status: "pending"
  },
  selectedDateRanges: [],
  transactions: {
    data: [],
    status: "pending"
  }
}

export const fetchDateRanges = createAsyncThunk("viewMoney/fetchDateRanges", async () => {
  const response: FinanceApiResponse<DateRangesData> = await axios.get(
    DATE_RANGES_URL
  );
  return response.data;
})

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
    setTimePeriod: (state, action: PayloadAction<TimePeriod["label"]>) => {
      state.timePeriod = action.payload;
    },
    setSelectedDateRanges: (state, action: PayloadAction<DateRange[]>) => {
      state.selectedDateRanges = action.payload
    },
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
    builder.addCase(fetchDateRanges.pending, state => {
      state.dateRanges.status = "loading";
    })
    builder.addCase(fetchDateRanges.fulfilled, (state, { payload }) => {
      state.dateRanges.status = "succeeded";
      state.dateRanges.data = payload;
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
export const { setTimePeriod, setSelectedDateRanges, setDateRange } = viewMoney.actions;
export const viewMoneyTimePeriod = (state: RootState) => state.viewMoney.timePeriod;
export const viewMoneyDateRanges = (state: RootState) => state.viewMoney.dateRanges;
export const viewMoneySelectedDateRanges = (state: RootState) => state.viewMoney.selectedDateRanges;
export const viewMoneyDateRange = (state: RootState) => state.viewMoney.dateRange;
export const viewMoneySummary = (state: RootState) => state.viewMoney.summary;
export const viewMoneyTransactions = (state: RootState) => state.viewMoney.transactions;