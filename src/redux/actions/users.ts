/**
 * redux/actions/users.ts
 * Async thunks for the /api/v1/users admin endpoints.
 */

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

// ─── Fetch all users ──────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users");
      return response.data; // { success, count, data }
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch users"));
    }
  },
);

// ─── Fetch single user ────────────────────────────────────────────────────────

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch user"));
    }
  },
);

// ─── Create user ──────────────────────────────────────────────────────────────

export interface CreateUserPayload {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  dob: string;
  role?: "user" | "admin";
  phoneNumber?: string;
  address?: string;
  status?: "active" | "inactive";
}

export const createUser = createAsyncThunk(
  "users/create",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/users", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to create user"));
    }
  },
);

// ─── Update user ──────────────────────────────────────────────────────────────

export interface UpdateUserPayload {
  id: string;
  data: Partial<Omit<CreateUserPayload, "password"> & { password?: string }>;
}

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: UpdateUserPayload, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to update user"));
    }
  },
);

// ─── Delete user ──────────────────────────────────────────────────────────────

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrMsg(error, "Failed to delete user"));
    }
  },
);
