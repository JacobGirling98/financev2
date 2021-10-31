import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DescriptionMapping, GetAllFormOptionsResponse, ReduxFetchState } from "../types/types";
import type { RootState } from "./store";
import axios from "axios";
import { FORM_OPTIONS_URL } from "../utils/api-urls";


const initialState: ReduxFetchState = {
  accounts: [],
  categories: [],
  descriptions: [],
  incomeSources: [],
  payees: [],
  descriptionMappings: [],
  status: "idle",
  error: null
}

export const fetchFormOptions = createAsyncThunk("formOptions/fetchFormOptions", async () => {
  const response: GetAllFormOptionsResponse = await axios.get(
    FORM_OPTIONS_URL
  );
  return response.data;
})

export const formOptions = createSlice({
  name: "formOptions",
  initialState,
  reducers: {
    addDescription: (state, action: PayloadAction<string>) => {
      state.descriptions.push(action.payload);
    },
    addDescriptionMappings: (state, action: PayloadAction<DescriptionMapping[]>) => {
      state.descriptionMappings = state.descriptionMappings.concat(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFormOptions.pending, state => {
        state.status = 'loading';
      })
    builder.addCase(fetchFormOptions.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.accounts = state.accounts.concat(payload.accounts);
        state.categories = state.categories.concat(payload.categories);
        state.descriptions = state.descriptions.concat(payload.descriptions);
        state.descriptionMappings = state.descriptionMappings.concat(payload.descriptionMappings);
        state.incomeSources = state.incomeSources.concat(payload.incomeSource);
        state.payees = state.payees.concat(payload.payees);
      })
      builder.addCase(fetchFormOptions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
      })
  }
})

export default formOptions.reducer;
export const { addDescription, addDescriptionMappings } = formOptions.actions;
export const selectAccounts = (state: RootState) => state.formOptions.accounts;
export const selectCategories = (state: RootState) => state.formOptions.categories;
export const selectDescriptions = (state: RootState) => state.formOptions.descriptions;
export const selectIncomeSources = (state: RootState) => state.formOptions.incomeSources;
export const selectPayees = (state: RootState) => state.formOptions.payees;
export const selectDescriptionMappings = (state: RootState) => state.formOptions.descriptionMappings;
