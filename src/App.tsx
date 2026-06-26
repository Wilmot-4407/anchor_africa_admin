import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMe } from "./redux/actions/auth";
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
              <Route path="/profile" element={<ProfileView />} />
              <Route
                path="/appointments"
                element={
                  <RoleRoute roles={["admin", "staff"]}>
                    <AppointmentsView />
                  </RoleRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <RoleRoute roles={["admin", "staff"]}>
                    <ClientsView />
                  </RoleRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <RoleRoute roles={["admin", "staff"]}>
                    <AnalyticsView />
                  </RoleRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <RoleRoute roles={["admin", "staff"]}>
                    <MessagesView />
                  </RoleRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <RoleRoute roles={["admin"]}>
                    <UsersView />
                  </RoleRoute>
                }
              />
              <Route
                path="/activity-log"
                element={
                  <RoleRoute roles={["admin"]}>
                    <ActivityLogView />
                  </RoleRoute>
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
      <div role="status" className="relative w-12 h-12">
        <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-75" />
        <div className="animate-ping absolute inset-0 rounded-full bg-accent-blue opacity-50 [animation-delay:200ms]" />
        <div className="absolute inset-0 rounded-full bg-accent-blue/80" />
        <span className="sr-only">Loading…</span>
      </div>
      <p className="text-sm text-slate-400 font-medium tracking-wide animate-pulse">
        Loading ANCHOR…
      </p>
    </div>
  );
}

function RoleRoute({ roles, children }: { roles: string[]; children: React.ReactNode }) {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  if (isLoading) return <PageLoader />;
  if (!user || !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  if (!isInitialized) return <PageLoader />;
  return isAuthenticated ? (
    <NavigationProvider>{children}</NavigationProvider>
  ) : (
    <Navigate to="/" replace />
  );
}

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  // On every mount, validate the session via the httpOnly cookie.
  // getMe resolves immediately if cookie is valid; rejects if not.
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

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
          element={
            !isInitialized ? <PageLoader /> :
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignInView />
          }
        />

        {/* Standalone pages (own Sidebar + Topbar) */}
        <Route
          path="/website"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin", "editor"]}>
                <WebsiteContent />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/*"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["admin", "editor", "staff"]}>
                <CampaignForms />
              </RoleRoute>
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
