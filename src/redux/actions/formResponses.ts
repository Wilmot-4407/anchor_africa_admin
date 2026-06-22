import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { toast } from "../../utils/toast";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

export interface FetchResponsesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const fetchResponses = createAsyncThunk(
  "formResponses/fetchAll",
  async (
    { formId, params = {} }: { formId: string; params?: FetchResponsesParams },
    { rejectWithValue },
  ) => {
    try {
      const { page = 1, limit = 10, status = "", search = "" } = params;
      const response = await api.get(`/forms/${formId}/responses`, {
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(search && { search }),
        },
      });
      return response.data; // { success, count, total, page, pages, data, statusSummary? }
    } catch (error) {
      const msg = getErrMsg(error, "Failed to fetch responses");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const fetchResponse = createAsyncThunk(
  "formResponses/fetchOne",
  async (
    { formId, responseId }: { formId: string; responseId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(`/forms/${formId}/responses/${responseId}`);
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to fetch response");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const updateResponseStatus = createAsyncThunk(
  "formResponses/updateStatus",
  async (
    { formId, responseId, status }: { formId: string; responseId: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(
        `/forms/${formId}/responses/${responseId}/status`,
        { status },
      );
      toast.success("Status updated.");
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to update status");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const deleteResponse = createAsyncThunk(
  "formResponses/delete",
  async (
    { formId, responseId }: { formId: string; responseId: string },
    { rejectWithValue },
  ) => {
    try {
      await api.delete(`/forms/${formId}/responses/${responseId}`);
      toast.success("Response deleted.");
      return responseId;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to delete response");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const exportResponses = createAsyncThunk(
  "formResponses/export",
  async (
    { formId, format = "csv" }: { formId: string; format?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(`/forms/${formId}/responses/export`, {
        params: { format },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `responses.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded.");
      return true;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to export responses");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
