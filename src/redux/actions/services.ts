import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { Service } from "../types";

const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

export const fetchServices = createAsyncThunk(
  "services/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/services");
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch services"));
    }
  },
);

// Admin version — includes unpublished services
export const fetchServicesAdmin = createAsyncThunk(
  "services/fetchServicesAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/services/admin/all");
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch services"));
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
      return rejectWithValue(getErrMsg(error, "Failed to fetch service"));
    }
  },
);

export const createService = createAsyncThunk(
  "services/createService",
  async (data: FormData | Partial<Service>, { rejectWithValue }) => {
    try {
      const response = await api.post("/services", data);
      toast.success("Service created successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to create service");
      toast.error(msg);
      return rejectWithValue(msg);
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
      toast.success("Service updated successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to update service");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/services/${id}`);
      toast.success("Service deleted successfully!");
      return id;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to delete service");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
