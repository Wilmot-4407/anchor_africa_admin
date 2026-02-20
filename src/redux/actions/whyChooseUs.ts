import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { WhyChooseUs } from "../types";

export const fetchWhyChooseUs = createAsyncThunk(
  "whyChooseUs/fetchContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/why-choose-us");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch why choose us content",
      );
    }
  },
);

export const upsertWhyChooseUs = createAsyncThunk(
  "whyChooseUs/upsertContent",
  async (data: Partial<WhyChooseUs>, { rejectWithValue }) => {
    try {
      const response = await api.post("/why-choose-us", data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update why choose us content",
      );
    }
  },
);

export const deleteWhyChooseUs = createAsyncThunk(
  "whyChooseUs/deleteContent",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/why-choose-us");
      return null;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete why choose us content",
      );
    }
  },
);
