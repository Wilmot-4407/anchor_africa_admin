import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { About } from "../types";

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
      const response = await api.post("/about", data);
      toast.success("About section saved successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to update about content");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const deleteAbout = createAsyncThunk(
  "about/deleteAbout",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/about");
      toast.success("About section deleted.");
      return null;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to delete about content");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
