import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { BlogPost } from "../types";

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
      const response = await api.get("/blog/admin/all");
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
      const response = await api.post("/blog", data);
      toast.success("Blog post created successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to create blog post");
      toast.error(msg);
      return rejectWithValue(msg);
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
      toast.success("Blog post updated successfully!");
      return response.data.data;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to update blog post");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const deleteBlogPost = createAsyncThunk(
  "blog/deletePost",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/blog/${id}`);
      toast.success("Blog post deleted successfully!");
      return id;
    } catch (error: unknown) {
      const msg = getErrMsg(error, "Failed to delete blog post");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
