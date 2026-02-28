import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { TeamMember } from "../types";

export const fetchTeamMembers = createAsyncThunk(
  "team/fetchMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/team/admin/all");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch team members";
      return rejectWithValue(msg);
    }
  },
);

// Explicit admin alias — includes inactive members
export const fetchTeamMembersAdmin = createAsyncThunk(
  "team/fetchMembersAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/team/admin/all");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch team members";
      return rejectWithValue(msg);
    }
  },
);

export const fetchTeamMember = createAsyncThunk(
  "team/fetchMember",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/team/${slug}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to fetch team member";
      return rejectWithValue(msg);
    }
  },
);

export const createTeamMember = createAsyncThunk(
  "team/createMember",
  async (data: FormData | Partial<TeamMember>, { rejectWithValue }) => {
    try {
      const response = await api.post("/team", data);
      toast.success("Team member created successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to create team member";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const updateTeamMember = createAsyncThunk(
  "team/updateMember",
  async (
    { id, data }: { id: string; data: FormData | Partial<TeamMember> },
    { rejectWithValue },
  ) => {
    try {
      // Uses /admin/:id to avoid collision with public /:slug route
      const response = await api.put(`/team/admin/${id}`, data);
      toast.success("Team member updated successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update team member";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const deleteTeamMember = createAsyncThunk(
  "team/deleteMember",
  async (id: string, { rejectWithValue }) => {
    try {
      // Uses /admin/:id to avoid collision with public /:slug route
      await api.delete(`/team/admin/${id}`);
      toast.success("Team member deleted successfully!");
      return id;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete team member";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
