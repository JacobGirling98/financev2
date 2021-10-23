import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { GetAllFormOptionsResponse } from "../types/types";
import type { RootState, AppDispatch } from "./store";
import axios from "axios";
import { FORM_OPTIONS_URL } from "../utils/api-urls";

interface categoriesState {
  categories: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
}

const initialState: categoriesState = {
  categories: [],
  status: "idle",
  error: null
}

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response: GetAllFormOptionsResponse = await axios.get(
    FORM_OPTIONS_URL
  );
  return response.data;
})

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, state => {
        state.status = 'loading';
      })
    builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.categories = state.categories.concat(payload.categories)
      })
      builder.addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
      })
  }
})

export default categoriesSlice.reducer;
export const selectCategories = (state: RootState) => state.categories.categories;
