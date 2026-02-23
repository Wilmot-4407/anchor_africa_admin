import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { Service } from "../types";

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/services");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch services",
      );
    }
  },
);

export const fetchService = createAsyncThunk(
  "services/fetchService",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/${slug}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch service",
      );
    }
  },
);

export const createService = createAsyncThunk(
  "services/createService",
  async (data: FormData | Partial<Service>, { rejectWithValue }) => {
    try {
      const response = await api.post("/services", data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to create service",
      );
    }
  },
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async (
    { id, data }: { id: string; data: FormData | Partial<Service> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/services/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update service",
      );
    }
  },
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/services/${id}`);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete service",
      );
    }
  },
);
