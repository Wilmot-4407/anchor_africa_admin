/**
 * store/actions/logs.ts
 *
 * Async thunks for the /api/v1/logs endpoints.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

// ─── Fetch all logs (admin, paginated + filterable) ───────────────────────────

export interface FetchLogsParams {
  page?: number;
  limit?: number;
  type?: string;
  action?: string;
  userName?: string;
  from?: string;
  to?: string;
}

export const fetchLogs = createAsyncThunk(
  "logs/fetchAll",
  async (params: FetchLogsParams = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));
      if (params.type) query.set("type", params.type);
      if (params.action) query.set("action", params.action);
      if (params.userName) query.set("userName", params.userName);
      if (params.from) query.set("from", params.from);
      if (params.to) query.set("to", params.to);

      const response = await api.get(`/logs?${query.toString()}`);
      return response.data; // { data, total, page, pages }
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch logs"));
    }
  },
);

// ─── Fetch logs by type ───────────────────────────────────────────────────────

export const fetchLogsByType = createAsyncThunk(
  "logs/fetchByType",
  async (
    {
      type,
      page = 1,
      limit = 50,
    }: { type: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        `/logs/by-type/${type}?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch logs by type"));
    }
  },
);

// ─── Fetch logs for a specific user ──────────────────────────────────────────

export const fetchLogsByUser = createAsyncThunk(
  "logs/fetchByUser",
  async (
    {
      userId,
      page = 1,
      limit = 50,
    }: { userId: string; page?: number; limit?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        `/logs/user/${userId}?page=${page}&limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch user logs"));
    }
  },
);

// ─── Fetch distinct types & actions (for filter dropdowns) ───────────────────

export const fetchLogTypes = createAsyncThunk(
  "logs/fetchTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/logs/types");
      return response.data.data; // { types: string[], actions: string[] }
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch log types"));
    }
  },
);

// ─── Fetch single log by ID ───────────────────────────────────────────────────

export const fetchLogById = createAsyncThunk(
  "logs/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/logs/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch log"));
    }
  },
);

// ─── Delete logs (admin bulk clear) ──────────────────────────────────────────

export interface DeleteLogsParams {
  type?: string;
  olderThanDays?: number;
}

export const deleteLogs = createAsyncThunk(
  "logs/delete",
  async (params: DeleteLogsParams = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.type) query.set("type", params.type);
      if (params.olderThanDays)
        query.set("olderThanDays", String(params.olderThanDays));

      const response = await api.delete(`/logs?${query.toString()}`);
      return response.data; // { deleted: number }
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to delete logs"));
    }
  },
);
