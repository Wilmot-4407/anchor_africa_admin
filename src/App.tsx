import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { logout, getMe } from "./redux/actions/auth";
import { AppDispatch, RootState } from "./redux/store";
import { NavigationProvider } from "./context/NavigationContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { CommandPalette } from "./components/layout/CommandPalette";
import { ToastContainer } from "./components/layout/ToastContainer";
import { SignInView } from "./pages/SignInView";
import { DashboardView } from "./pages/DashboardView";
import { WebsiteEditor } from "./pages/WebsiteEditor";
import { AppointmentsView } from "./pages/AppointmentsView";
import { ClientsView } from "./pages/ClientsView";
import { AnalyticsView } from "./pages/AnalyticsView";
import { ActivityLogView } from "./pages/ActivityLogView";
import { MessagesView } from "./pages/MessagesView";
import { SettingsView } from "./pages/SettingsView";

function AppShell() {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-stone-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/dashboard" element={<DashboardView />} />

              {/*
               * ALL website sub-pages (/website, /website/about, /website/blog, etc.)
               * are handled by WebsiteEditor, which reads activeSubsection from
               * NavigationContext (synced from the URL by NavigationContext itself).
               */}
              <Route path="/website/*" element={<WebsiteEditor />} />

              <Route path="/appointments" element={<AppointmentsView />} />
              <Route path="/clients" element={<ClientsView />} />
              <Route path="/analytics" element={<AnalyticsView />} />
              <Route path="/activity-log" element={<ActivityLogView />} />
              <Route path="/messages" element={<MessagesView />} />
              <Route path="/settings" element={<SettingsView />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Overlays */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return isAuthenticated ? (
    <NavigationProvider>{children}</NavigationProvider>
  ) : (
    <Navigate to="/" replace />
  );
}

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          dispatch(logout());
        } else {
          dispatch(getMe());
        }
      } catch {
        dispatch(logout());
      }
    }
  }, [dispatch, token]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignInView />
          )
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
