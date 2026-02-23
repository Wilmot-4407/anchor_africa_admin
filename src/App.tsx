import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { logout, getMe } from "./redux/actions/auth";
import { AppDispatch, RootState } from "./redux/store";
import { NavigationProvider } from "./context/NavigationContext";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { CommandPalette } from "./components/layout/CommandPalette";
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
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/website/*" element={<WebsiteEditor />} />
              <Route path="/appointments" element={<AppointmentsView />} />
              <Route path="/clients" element={<ClientsView />} />
              <Route path="/analytics" element={<AnalyticsView />} />
              <Route path="/activity-log" element={<ActivityLogView />} />
              <Route path="/messages" element={<MessagesView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette />
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
    <>
      {/* Global toast notifications — positioned top-right, respects dark mode */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "14px",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
          loading: {
            iconTheme: { primary: "#f59e0b", secondary: "#fff" },
          },
        }}
      />

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
    </>
  );
}
