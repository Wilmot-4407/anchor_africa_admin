import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { Faq } from "../types";

export const fetchFaq = createAsyncThunk(
  "faqs/fetchContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/faqs");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch faq content",
      );
    }
  },
);

export const upsertFaq = createAsyncThunk(
  "faqs/upsertContent",
  async (data: FormData | Partial<Faq>, { rejectWithValue }) => {
    try {
      const response = await api.post("/faqs", data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update faq content",
      );
    }
  },
);

export const deleteFaq = createAsyncThunk(
  "faqs/deleteContent",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/faqs");
      return null;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete faq content",
      );
    }
  },
);
