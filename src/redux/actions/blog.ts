import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { BlogPost } from "../types";

export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/blog");
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch blog posts",
      );
    }
  },
);

export const fetchBlogPost = createAsyncThunk(
  "blog/fetchPost",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blog/${slug}`);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch blog post",
      );
    }
  },
);

export const createBlogPost = createAsyncThunk(
  "blog/createPost",
  async (data: Partial<BlogPost>, { rejectWithValue }) => {
    try {
      const response = await api.post("/blog", data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to create blog post",
      );
    }
  },
);

export const updateBlogPost = createAsyncThunk(
  "blog/updatePost",
  async (
    { id, data }: { id: string; data: Partial<BlogPost> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/blog/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update blog post",
      );
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
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete blog post",
      );
    }
  },
);
