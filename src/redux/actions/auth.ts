import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { success } = response.data;

      if (success) {
        // httpOnly cookie is now set by the server — no token in response body
        const userResponse = await api.get("/auth/me");
        const user = userResponse.data.data;
        toast.success(`Welcome back, ${user.firstName || user.userName}!`);
        return { user };
      }
      return rejectWithValue("Login failed");
    } catch {
      // Generic message to avoid leaking whether email exists
      const msg = "Invalid email or password";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      userName: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      dob: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { success } = response.data;

      if (success) {
        const userResponse = await api.get("/auth/me");
        const user = userResponse.data.data;
        toast.success("Account created successfully!");
        return { user };
      }
      return rejectWithValue("Registration failed");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const msg = err.response?.data?.error || "Registration failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data.data;
    } catch {
      return rejectWithValue("Session expired");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("/auth/logout");
      toast.success("You've been signed out.");
      return null;
    } catch {
      // Even if the server call fails, the local state will be cleared
      // by logout.rejected in the slice
      return rejectWithValue("Logout failed");
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    data: { currentPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put("/auth/updatepassword", data);
      toast.success("Password updated successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const msg = err.response?.data?.error || "Password update failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
