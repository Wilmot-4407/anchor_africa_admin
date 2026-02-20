import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, success } = response.data;

      if (success && token) {
        localStorage.setItem("token", token);
        // Fetch user data after login
        const userResponse = await api.get("/auth/me");
        const user = userResponse.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        return { token, user };
      }
      return rejectWithValue("Login failed");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Login failed");
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
      const { token, success } = response.data;

      if (success && token) {
        localStorage.setItem("token", token);
        const userResponse = await api.get("/auth/me");
        const user = userResponse.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        return { token, user };
      }
      return rejectWithValue("Registration failed");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      const user = response.data.data;
      return user;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.get("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Logout failed");
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
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Password update failed",
      );
    }
  },
);
