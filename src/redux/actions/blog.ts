import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { BlogPost } from "../types";

// BUG FIX: The error handler in error.js returns { success: false, error: "..." }
// using the key "error", NOT "message". All actions were reading data?.message
// which was always undefined, so the client always saw the generic fallback
// "Failed to fetch/create/etc." instead of the real server error.
// Fix: read data?.error first, then fall back to data?.message for safety.
const getErrMsg = (error: unknown, fallback: string): string => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
  };
  return err.response?.data?.error || err.response?.data?.message || fallback;
};

export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/blog");
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch blog posts"));
    }
  },
);

export const fetchBlogPost = createAsyncThunk(
  "blog/fetchPost",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/slug/${slug}`);
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to fetch blog post"));
    }
  },
);

export const createBlogPost = createAsyncThunk(
  "blog/createPost",
  async (data: FormData | Partial<BlogPost>, { rejectWithValue }) => {
    try {
      // Do NOT manually set Content-Type for FormData.
      // Axios/browser XHR automatically sets:
      //   Content-Type: multipart/form-data; boundary=----XYZ
      // Overriding it drops the boundary token → multer can't parse → 500.
      const response = await api.post("/blog", data);
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to create blog post"));
    }
  },
);

export const updateBlogPost = createAsyncThunk(
  "blog/updatePost",
  async (
    { id, data }: { id: string; data: FormData | Partial<BlogPost> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/blog/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to update blog post"));
    }
  },
);

export const deleteBlogPost = createAsyncThunk(
  "blog/deletePost",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/blog/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrMsg(error, "Failed to delete blog post"));
    }
  },
);
