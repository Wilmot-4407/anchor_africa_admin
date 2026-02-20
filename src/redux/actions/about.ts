import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { About } from "../types";

export const fetchAbout = createAsyncThunk(
  "about/fetchAbout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/about");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch about content",
      );
    }
  },
);

export const upsertAbout = createAsyncThunk(
  "about/upsertAbout",
  async (data: Partial<About>, { rejectWithValue }) => {
    try {
      const response = await api.post("/about", data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update about content",
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
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete about content",
      );
    }
  },
);
