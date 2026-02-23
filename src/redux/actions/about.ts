import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { About } from "../types";

// BUG FIX: Same error key mismatch as blog.ts — server returns data.error,
// not data.message. Extract into a shared helper.
const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

export const fetchAbout = createAsyncThunk(
  "about/fetchAbout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/about");
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch about content"));
    }
  },
);

export const upsertAbout = createAsyncThunk(
  "about/upsertAbout",
  async (data: FormData | Partial<About>, { rejectWithValue }) => {
    try {
      // BUG FIX: Do NOT manually set Content-Type for FormData.
      // The previous code set "Content-Type: multipart/form-data" without the
      // boundary token. In browsers this is overridden by XHR automatically,
      // but it is incorrect and breaks in non-browser environments.
      // Axios detects FormData and sets the correct header + boundary automatically.
      const response = await api.post("/about", data);
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrMsg(error, "Failed to update about content"),
      );
    }
  },
);

export const deleteAbout = createAsyncThunk(
  "about/deleteAbout",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/about");
      return null;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrMsg(error, "Failed to delete about content"),
      );
    }
  },
);
