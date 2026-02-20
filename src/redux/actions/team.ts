import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { TeamMember } from "../types";

export const fetchTeamMembers = createAsyncThunk(
  "team/fetchMembers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/team");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch team members",
      );
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
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch team member",
      );
    }
  },
);

export const createTeamMember = createAsyncThunk(
  "team/createMember",
  async (data: Partial<TeamMember>, { rejectWithValue }) => {
    try {
      const response = await api.post("/team", data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to create team member",
      );
    }
  },
);

export const updateTeamMember = createAsyncThunk(
  "team/updateMember",
  async (
    { id, data }: { id: string; data: Partial<TeamMember> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/team/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update team member",
      );
    }
  },
);

export const deleteTeamMember = createAsyncThunk(
  "team/deleteMember",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/team/${id}`);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete team member",
      );
    }
  },
);
