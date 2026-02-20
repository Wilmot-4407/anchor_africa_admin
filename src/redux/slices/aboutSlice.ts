import { createSlice } from "@reduxjs/toolkit";
import { AboutState } from "../types";
import { fetchAbout, upsertAbout, deleteAbout } from "../actions/about";

const initialState: AboutState = {
  about: null,
  isLoading: false,
  error: null,
};

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch About
    builder.addCase(fetchAbout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAbout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.about = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAbout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Upsert About
    builder.addCase(upsertAbout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(upsertAbout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.about = action.payload;
      state.error = null;
    });
    builder.addCase(upsertAbout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete About
    builder.addCase(deleteAbout.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteAbout.fulfilled, (state) => {
      state.isLoading = false;
      state.about = null;
      state.error = null;
    });
    builder.addCase(deleteAbout.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = aboutSlice.actions;
export default aboutSlice.reducer;
