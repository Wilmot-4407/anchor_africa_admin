import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import servicesReducer from "./slices/servicesSlice";
import teamReducer from "./slices/teamSlice";
import aboutReducer from "./slices/aboutSlice";
import whyChooseUsReducer from "./slices/whyChooseUsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    services: servicesReducer,
    team: teamReducer,
    about: aboutReducer,
    whyChooseUs: whyChooseUsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled"],
        ignoredPaths: ["auth.user"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
