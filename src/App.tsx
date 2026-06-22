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
import { WebsiteContent } from "./pages/WebsiteContent";
import { CampaignForms } from "./pages/CampaignForms";
import { AppointmentsView } from "./pages/AppointmentsView";
import { ClientsView } from "./pages/ClientsView";
import { AnalyticsView } from "./pages/AnalyticsView";
import { ActivityLogView } from "./pages/ActivityLogView";
import { MessagesView } from "./pages/MessagesView";
import { ProfileView } from "./pages/ProfileView";
import { UsersView } from "./pages/UsersView";

/** Shared app shell for the inner pages (Dashboard, Appointments, etc.) */
function AppShell() {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0f1a2a]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-brand">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/appointments" element={<AppointmentsView />} />
              <Route path="/clients" element={<ClientsView />} />
              <Route path="/analytics" element={<AnalyticsView />} />
              <Route path="/messages" element={<MessagesView />} />
              <Route path="/profile" element={<ProfileView />} />
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
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0f1a2a] gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent-blue animate-spin animation-delay-150" />
      </div>
      <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">
        Loading ANCHOR…
      </p>
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  if (isLoading) return <PageLoader />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  if (isLoading) return <PageLoader />;
  return isAuthenticated ? (
    <NavigationProvider>{children}</NavigationProvider>
  ) : (
    <Navigate to="/" replace />
  );
}

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

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
        theme="dark"
        toastStyle={{
          borderRadius: "12px",
          fontSize: "14px",
          backgroundColor: "#1b2940",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
        progressClassName="!bg-accent-blue"
      />

      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignInView />}
        />

        {/* Standalone pages (own Sidebar + Topbar) */}
        <Route
          path="/website"
          element={
            <ProtectedRoute>
              <WebsiteContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/*"
          element={
            <ProtectedRoute>
              <CampaignForms />
            </ProtectedRoute>
          }
        />

        {/* Shell-wrapped pages */}
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
