import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

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
        const userResponse = await api.get("/auth/me");
        const user = userResponse.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome back, ${user.firstName || user.userName}!`);
        return { token, user };
      }
      return rejectWithValue("Login failed");
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Invalid email or password");
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
      const { token, success } = response.data;

      if (success && token) {
        localStorage.setItem("token", token);
        const userResponse = await api.get("/auth/me");
        const user = userResponse.data.data;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Account created successfully!");
        return { token, user };
      }
      return rejectWithValue("Registration failed");
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Registration failed");
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
    } catch (error: unknown) {
      // Silent failure — token may just be expired, no toast needed
      return rejectWithValue(getErrMsg(error, "Failed to fetch user"));
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
      toast.success("You've been signed out.");
      return null;
    } catch (error: unknown) {
      // Still clear local storage even if server call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const msg = getErrMsg(error, "Logout failed");
      toast.error(msg);
      return rejectWithValue(msg);
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
      const msg = getErrMsg(error, "Password update failed");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
