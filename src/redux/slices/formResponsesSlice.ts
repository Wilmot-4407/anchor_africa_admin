import { createSlice } from "@reduxjs/toolkit";
import type { FormResponsesState } from "../types";
import {
  fetchResponses,
  fetchResponse,
  updateResponseStatus,
  deleteResponse,
  exportResponses,
} from "../actions/formResponses";

const initialState: FormResponsesState = {
  items: [],
  currentResponse: null,
  isLoading: false,
  isExporting: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  statusSummary: {},
};

const formResponsesSlice = createSlice({
  name: "formResponses",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentResponse(state) {
      state.currentResponse = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchResponses ─────────────────────────────────────────────────────
    builder
      .addCase(fetchResponses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data ?? [];
        state.totalCount = action.payload.total ?? 0;
        state.currentPage = action.payload.page ?? 1;
        state.totalPages = action.payload.pages ?? 1;
        if (action.payload.statusSummary) {
          state.statusSummary = action.payload.statusSummary;
        }
      })
      .addCase(fetchResponses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── fetchResponse ──────────────────────────────────────────────────────
    builder
      .addCase(fetchResponse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchResponse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResponse = action.payload;
      })
      .addCase(fetchResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── updateResponseStatus ───────────────────────────────────────────────
    builder.addCase(updateResponseStatus.fulfilled, (state, action) => {
      const idx = state.items.findIndex((r) => r._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
      if (state.currentResponse?._id === action.payload._id) {
        state.currentResponse = action.payload;
      }
    });

    // ── deleteResponse ─────────────────────────────────────────────────────
    builder.addCase(deleteResponse.fulfilled, (state, action) => {
      state.items = state.items.filter((r) => r._id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
      if (state.currentResponse?._id === action.payload) {
        state.currentResponse = null;
      }
    });

    // ── exportResponses ────────────────────────────────────────────────────
    builder
      .addCase(exportResponses.pending, (state) => {
        state.isExporting = true;
      })
      .addCase(exportResponses.fulfilled, (state) => {
        state.isExporting = false;
      })
      .addCase(exportResponses.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentResponse } = formResponsesSlice.actions;
export default formResponsesSlice.reducer;
