import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
import servicesReducer from "./slices/servicesSlice";
import teamReducer from "./slices/teamSlice";
import aboutReducer from "./slices/aboutSlice";
import faqReducer from "./slices/faqsSlice";
import logsReducer from "./slices/logsSlice";
import usersReducer from "./slices/usersSlice";
import formsReducer from "./slices/formsSlice";
import formResponsesReducer from "./slices/formResponsesSlice";
import formAnalyticsReducer from "./slices/formAnalyticsSlice";
import type { RootState } from "./types";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    services: servicesReducer,
    team: teamReducer,
    about: aboutReducer,
    faqs: faqReducer,
    logs: logsReducer,
    users: usersReducer,
    forms: formsReducer,
    formResponses: formResponsesReducer,
    formAnalytics: formAnalyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/login/fulfilled"],
        ignoredPaths: ["auth.user"],
      },
    }),
});

export type { RootState };
export type AppDispatch = typeof store.dispatch;

export default store;
