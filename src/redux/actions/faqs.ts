import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { Faq } from "../types";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

export const fetchFaq = createAsyncThunk(
  "faqs/fetchContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/faqs");
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch FAQ content"));
    }
  },
);

export const upsertFaq = createAsyncThunk(
  "faqs/upsertContent",
  async (data: FormData | Partial<Faq>, { rejectWithValue }) => {
    try {
      const response = await api.post("/faqs", data);
      toast.success("FAQ saved successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to update FAQ content");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const deleteFaq = createAsyncThunk(
  "faqs/deleteContent",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/faqs");
      toast.success("FAQ deleted successfully!");
      return null;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to delete FAQ content");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
