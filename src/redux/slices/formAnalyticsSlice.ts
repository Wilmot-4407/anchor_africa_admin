import { createSlice } from "@reduxjs/toolkit";
import type { FormAnalyticsState } from "../types";
import { fetchFormAnalytics } from "../actions/formAnalytics";

const initialState: FormAnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
};

const formAnalyticsSlice = createSlice({
  name: "formAnalytics",
  initialState,
  reducers: {
    clearAnalytics(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFormAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchFormAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnalytics } = formAnalyticsSlice.actions;
export default formAnalyticsSlice.reducer;
