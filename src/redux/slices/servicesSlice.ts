import { createSlice } from "@reduxjs/toolkit";
import { ServiceState } from "../types";
import {
  fetchServices,
  fetchServicesAdmin,
  fetchService,
  createService,
  updateService,
  deleteService,
} from "../actions/services";

const initialState: ServiceState = {
  services: [],
  currentService: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Services (public)
    builder.addCase(fetchServices.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchServices.fulfilled, (state, action) => {
      state.isLoading = false;
      state.services = action.payload;
      state.totalCount = action.payload.length;
      state.error = null;
    });
    builder.addCase(fetchServices.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Services (admin — includes unpublished)
    builder.addCase(fetchServicesAdmin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchServicesAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.services = action.payload;
      state.totalCount = action.payload.length;
      state.error = null;
    });
    builder.addCase(fetchServicesAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Single Service
    builder.addCase(fetchService.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchService.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentService = action.payload;
      state.error = null;
    });
    builder.addCase(fetchService.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Service
    builder.addCase(createService.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createService.fulfilled, (state, action) => {
      state.isLoading = false;
      state.services.push(action.payload);
      state.totalCount += 1;
      state.error = null;
    });
    builder.addCase(createService.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Service
    builder.addCase(updateService.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateService.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.services.findIndex(
        (s) => s._id === action.payload._id,
      );
      if (index !== -1) {
        state.services[index] = action.payload;
      }
      if (state.currentService?._id === action.payload._id) {
        state.currentService = action.payload;
      }
      state.error = null;
    });
    builder.addCase(updateService.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Service
    builder.addCase(deleteService.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteService.fulfilled, (state, action) => {
      state.isLoading = false;
      state.services = state.services.filter((s) => s._id !== action.payload);
      state.totalCount -= 1;
      state.error = null;
    });
    builder.addCase(deleteService.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearCurrentService } = servicesSlice.actions;
export default servicesSlice.reducer;
