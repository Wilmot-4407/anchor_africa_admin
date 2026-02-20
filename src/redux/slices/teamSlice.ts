import { createSlice } from "@reduxjs/toolkit";
import { TeamState } from "../types";
import {
  fetchTeamMembers,
  fetchTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../actions/team";

const initialState: TeamState = {
  members: [],
  currentMember: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMember: (state) => {
      state.currentMember = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Members
    builder.addCase(fetchTeamMembers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTeamMembers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.members = action.payload;
      state.totalCount = action.payload.length;
      state.error = null;
    });
    builder.addCase(fetchTeamMembers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Single Member
    builder.addCase(fetchTeamMember.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTeamMember.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentMember = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTeamMember.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Member
    builder.addCase(createTeamMember.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTeamMember.fulfilled, (state, action) => {
      state.isLoading = false;
      state.members.push(action.payload);
      state.totalCount += 1;
      state.error = null;
    });
    builder.addCase(createTeamMember.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Member
    builder.addCase(updateTeamMember.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTeamMember.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.members.findIndex(
        (m) => m._id === action.payload._id,
      );
      if (index !== -1) {
        state.members[index] = action.payload;
      }
      if (state.currentMember?._id === action.payload._id) {
        state.currentMember = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateTeamMember.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Member
    builder.addCase(deleteTeamMember.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteTeamMember.fulfilled, (state, action) => {
      state.isLoading = false;
      state.members = state.members.filter((m) => m._id !== action.payload);
      state.totalCount -= 1;
      state.error = null;
    });
    builder.addCase(deleteTeamMember.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearCurrentMember } = teamSlice.actions;
export default teamSlice.reducer;
