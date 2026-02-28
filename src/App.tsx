import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { ProfileView } from "./pages/ProfileView";
import { UsersView } from "./pages/UsersView";

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
              <Route path="/messages" element={<MessagesView />} />
              <Route path="/profile" element={<ProfileView />} />
              {/* Admin-only routes */}
              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <UsersView />
                  </AdminRoute>
                }
              />
              <Route
                path="/activity-log"
                element={
                  <AdminRoute>
                    <ActivityLogView />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-secondary animate-spin animation-delay-150" />
      </div>
      <p className="text-sm text-slate-500 font-medium tracking-wide animate-pulse">
        Loading ANCHOR…
      </p>
    </div>
  );
}

/** Blocks non-admin users from accessing admin-only pages */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  if (isLoading) return <PageLoader />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isLoading) return <PageLoader />;

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
        if (decoded.exp < Date.now() / 1000) {
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
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastStyle={{
          borderRadius: "10px",
          fontSize: "14px",
          boxShadow:
            "0 4px 12px -2px rgba(5,135,137,0.12), 0 2px 6px -2px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
        }}
        progressClassName="!bg-primary"
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
