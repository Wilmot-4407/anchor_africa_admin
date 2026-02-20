import { createSlice } from "@reduxjs/toolkit";
import { BlogState } from "../types";
import {
  fetchBlogPosts,
  fetchBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../actions/blog";

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder.addCase(fetchBlogPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchBlogPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
      state.totalCount = action.payload.length;
      state.error = null;
    });
    builder.addCase(fetchBlogPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Single Post
    builder.addCase(fetchBlogPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchBlogPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentPost = action.payload;
      state.error = null;
    });
    builder.addCase(fetchBlogPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Post
    builder.addCase(createBlogPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createBlogPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts.push(action.payload);
      state.totalCount += 1;
      state.error = null;
    });
    builder.addCase(createBlogPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Post
    builder.addCase(updateBlogPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateBlogPost.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.posts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?._id === action.payload._id) {
        state.currentPost = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateBlogPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Post
    builder.addCase(deleteBlogPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteBlogPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.filter((p) => p._id !== action.payload);
      state.totalCount -= 1;
      state.error = null;
    });
    builder.addCase(deleteBlogPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;
