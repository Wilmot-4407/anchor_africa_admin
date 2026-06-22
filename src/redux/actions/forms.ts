/**
 * redux/actions/forms.ts
 * Async thunks for the /api/v1/forms admin endpoints.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { toast } from "../../utils/toast";
import type { CampaignFormCategory, CampaignFormStatus, FormFieldRecord, FormSettings } from "../types";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

// ─── Payload Interfaces ───────────────────────────────────────────────────────

export interface FetchFormsParams {
  page?: number;
  limit?: number;
  status?: CampaignFormStatus | "";
  category?: CampaignFormCategory | "";
  search?: string;
}

export interface CreateFormPayload {
  title: string;
  category: CampaignFormCategory;
  description: string;
  fields: FormFieldRecord[];
  settings?: Partial<FormSettings>;
}

export interface UpdateFormPayload {
  id: string;
  data: Partial<CreateFormPayload & { status: CampaignFormStatus }>;
}

// ─── Fetch all forms (paginated + filtered) ───────────────────────────────────

export const fetchForms = createAsyncThunk(
  "forms/fetchAll",
  async (params: FetchFormsParams = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status = "", category = "", search = "" } = params;
      const response = await api.get("/forms", {
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(category && { category }),
          ...(search && { search }),
        },
      });
      return response.data; // { success, count, total, page, pages, data }
    } catch (error) {
      const msg = getErrMsg(error, "Failed to fetch forms");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Fetch forms overview / stats ─────────────────────────────────────────────

export const fetchFormsOverview = createAsyncThunk(
  "forms/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/forms/analytics/overview");
      return response.data.data; // { totalForms, totalViews, totalSubmissions, formsByStatus, topForms }
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch overview"));
    }
  },
);

// ─── Fetch single form ────────────────────────────────────────────────────────

export const fetchForm = createAsyncThunk(
  "forms/fetchOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/forms/${id}`);
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to fetch form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Create form ──────────────────────────────────────────────────────────────

export const createForm = createAsyncThunk(
  "forms/create",
  async (payload: CreateFormPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/forms", payload);
      toast.success("Form created successfully!");
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to create form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Update form ──────────────────────────────────────────────────────────────

export const updateForm = createAsyncThunk(
  "forms/update",
  async ({ id, data }: UpdateFormPayload, { rejectWithValue }) => {
    try {
      const response = await api.put(`/forms/${id}`, data);
      toast.success("Form saved!");
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to update form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Delete form ──────────────────────────────────────────────────────────────

export const deleteForm = createAsyncThunk(
  "forms/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/forms/${id}`);
      toast.success("Form deleted.");
      return id;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to delete form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Publish form ─────────────────────────────────────────────────────────────

export const publishForm = createAsyncThunk(
  "forms/publish",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/forms/${id}/publish`);
      toast.success("Form published!");
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to publish form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Archive form ─────────────────────────────────────────────────────────────

export const archiveForm = createAsyncThunk(
  "forms/archive",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/forms/${id}/archive`);
      toast.success("Form archived.");
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to archive form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Unarchive form ───────────────────────────────────────────────────────────

export const unarchiveForm = createAsyncThunk(
  "forms/unarchive",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/forms/${id}/unarchive`);
      toast.success("Form restored to draft.");
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to unarchive form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ─── Duplicate form ───────────────────────────────────────────────────────────

export const duplicateForm = createAsyncThunk(
  "forms/duplicate",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/forms/${id}/duplicate`);
      toast.success("Form duplicated!");
      return response.data.data;
    } catch (error) {
      const msg = getErrMsg(error, "Failed to duplicate form");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
