import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isHeaderInfoModalOpen: false,
  isVideoDialogOpen: false,
  theme: "skin-1",
  isLoading: false,
  activeAccordion: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleHeaderInfoModal: (state) => {
      state.isHeaderInfoModalOpen = !state.isHeaderInfoModalOpen;
    },
    toggleVideoDialog: (state) => {
      state.isVideoDialogOpen = !state.isVideoDialogOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setActiveAccordion: (state, action) => {
      state.activeAccordion = action.payload;
    },
  },
});

export const {
  toggleHeaderInfoModal,
  toggleVideoDialog,
  setTheme,
  setLoading,
  setActiveAccordion,
} = uiSlice.actions;
export default uiSlice.reducer;
