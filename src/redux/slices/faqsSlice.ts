import { createSlice } from "@reduxjs/toolkit";
import { FaqState } from "../types";
import { fetchFaq, upsertFaq, deleteFaq } from "../actions/faqs";

const initialState: FaqState = {
  content: null,
  isLoading: false,
  error: null,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Faq
    builder.addCase(fetchFaq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFaq.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
      state.error = null;
    });
    builder.addCase(fetchFaq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Upsert Faq
    builder.addCase(upsertFaq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(upsertFaq.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
      state.error = null;
    });
    builder.addCase(upsertFaq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Faq
    builder.addCase(deleteFaq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteFaq.fulfilled, (state) => {
      state.isLoading = false;
      state.content = null;
      state.error = null;
    });
    builder.addCase(deleteFaq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = faqSlice.actions;
export default faqSlice.reducer;
