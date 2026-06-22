import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { toast } from "../../utils/toast";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

export const fetchFormAnalytics = createAsyncThunk(
  "formAnalytics/fetch",
  async (formId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${formId}/analytics`);
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to fetch analytics");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
