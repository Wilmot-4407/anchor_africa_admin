/**
 * store/slices/logsSlice.ts
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LogState } from "../types";
import {
  fetchLogs,
  fetchLogsByType,
  fetchLogsByUser,
  fetchLogTypes,
  fetchLogById,
  deleteLogs,
} from "../actions/logs";

const initialState: LogState = {
  logs: [],
  currentLog: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  availableTypes: [],
  availableActions: [],
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLogs: (state) => {
      state.logs = [];
      state.totalCount = 0;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── fetchLogs ──────────────────────────────────────────────────────────
    builder.addCase(fetchLogs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLogs.fulfilled, (state, action) => {
      state.isLoading = false;
      state.logs = action.payload.data;
      state.totalCount = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.pages;
    });
    builder.addCase(fetchLogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ── fetchLogsByType ────────────────────────────────────────────────────
    builder.addCase(fetchLogsByType.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLogsByType.fulfilled, (state, action) => {
      state.isLoading = false;
      state.logs = action.payload.data;
      state.totalCount = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.pages;
    });
    builder.addCase(fetchLogsByType.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ── fetchLogsByUser ────────────────────────────────────────────────────
    builder.addCase(fetchLogsByUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLogsByUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.logs = action.payload.data;
      state.totalCount = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.pages;
    });
    builder.addCase(fetchLogsByUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ── fetchLogTypes ──────────────────────────────────────────────────────
    builder.addCase(fetchLogTypes.fulfilled, (state, action) => {
      state.availableTypes = action.payload.types ?? [];
      state.availableActions = action.payload.actions ?? [];
    });

    // ── fetchLogById ───────────────────────────────────────────────────────
    builder.addCase(fetchLogById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLogById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentLog = action.payload;
    });
    builder.addCase(fetchLogById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ── deleteLogs ─────────────────────────────────────────────────────────
    builder.addCase(deleteLogs.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteLogs.fulfilled, (state) => {
      state.isLoading = false;
      state.logs = [];
      state.totalCount = 0;
    });
    builder.addCase(deleteLogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearLogs, setCurrentPage } = logsSlice.actions;
export default logsSlice.reducer;
