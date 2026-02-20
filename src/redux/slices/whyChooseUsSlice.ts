import { createSlice } from "@reduxjs/toolkit";
import { WhyChooseUsState } from "../types";
import {
  fetchWhyChooseUs,
  upsertWhyChooseUs,
  deleteWhyChooseUs,
} from "../actions/whyChooseUs";

const initialState: WhyChooseUsState = {
  content: null,
  isLoading: false,
  error: null,
};

const whyChooseUsSlice = createSlice({
  name: "whyChooseUs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch WhyChooseUs
    builder.addCase(fetchWhyChooseUs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWhyChooseUs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
      state.error = null;
    });
    builder.addCase(fetchWhyChooseUs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Upsert WhyChooseUs
    builder.addCase(upsertWhyChooseUs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(upsertWhyChooseUs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
      state.error = null;
    });
    builder.addCase(upsertWhyChooseUs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete WhyChooseUs
    builder.addCase(deleteWhyChooseUs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteWhyChooseUs.fulfilled, (state) => {
      state.isLoading = false;
      state.content = null;
      state.error = null;
    });
    builder.addCase(deleteWhyChooseUs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = whyChooseUsSlice.actions;
export default whyChooseUsSlice.reducer;
