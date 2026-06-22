import { createSlice } from "@reduxjs/toolkit";
import type { FormsState } from "../types";
import {
  fetchForms,
  fetchFormsOverview,
  fetchForm,
  createForm,
  updateForm,
  deleteForm,
  publishForm,
  archiveForm,
  unarchiveForm,
  duplicateForm,
} from "../actions/forms";

const initialState: FormsState = {
  items: [],
  currentForm: null,
  overview: null,
  isLoading: false,
  isSaving: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentForm(state) {
      state.currentForm = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchForms ─────────────────────────────────────────────────────────
    builder
      .addCase(fetchForms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data ?? [];
        state.totalCount = action.payload.total ?? 0;
        state.currentPage = action.payload.page ?? 1;
        state.totalPages = action.payload.pages ?? 1;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── fetchFormsOverview ─────────────────────────────────────────────────
    builder.addCase(fetchFormsOverview.fulfilled, (state, action) => {
      state.overview = action.payload;
    });

    // ── fetchForm ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentForm = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── createForm ─────────────────────────────────────────────────────────
    builder
      .addCase(createForm.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentForm = action.payload;
        state.items.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createForm.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });

    // ── updateForm ─────────────────────────────────────────────────────────
    builder
      .addCase(updateForm.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentForm = action.payload;
        const idx = state.items.findIndex((f) => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });

    // ── deleteForm ─────────────────────────────────────────────────────────
    builder
      .addCase(deleteForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((f) => f._id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        if (state.currentForm?._id === action.payload) state.currentForm = null;
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── publishForm ────────────────────────────────────────────────────────
    builder
      .addCase(publishForm.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(publishForm.fulfilled, (state, action) => {
        state.isSaving = false;
        state.currentForm = action.payload;
        const idx = state.items.findIndex((f) => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(publishForm.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });

    // ── archiveForm ────────────────────────────────────────────────────────
    builder
      .addCase(archiveForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(archiveForm.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((f) => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentForm?._id === action.payload._id) state.currentForm = action.payload;
      })
      .addCase(archiveForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── unarchiveForm ──────────────────────────────────────────────────────
    builder
      .addCase(unarchiveForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(unarchiveForm.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.items.findIndex((f) => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentForm?._id === action.payload._id) state.currentForm = action.payload;
      })
      .addCase(unarchiveForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── duplicateForm ──────────────────────────────────────────────────────
    builder
      .addCase(duplicateForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(duplicateForm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(duplicateForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentForm } = formsSlice.actions;
export default formsSlice.reducer;
