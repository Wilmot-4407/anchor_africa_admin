import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  Calendar,
  Users,
  BarChart3,
  Clock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  UserCog,
  ClipboardList,
  AlertTriangle,
  Anchor,
} from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";
import { logout } from "../../redux/actions/auth";
import { AppDispatch, RootState } from "../../redux/store";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  adminOnly?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Website", icon: Globe, path: "/website" },
  { label: "Campaign Forms", icon: ClipboardList, path: "/forms" },
  { label: "Appointments", icon: Calendar, path: "/appointments" },
  { label: "Clients", icon: Users, path: "/clients" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
];

const adminNavItems: NavItem[] = [
  { label: "User Management", icon: UserCog, path: "/users", adminOnly: true },
  { label: "Activity Log", icon: Clock, path: "/activity-log", adminOnly: true },
];

function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-[#1b2940] border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Sign Out</h3>
        <p className="text-sm text-slate-400 mt-2">
          Are you sure you want to sign out of the admin portal?
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const visibleAdminItems = isAdmin ? adminNavItems : [];
  const allItems = [...mainNavItems, ...visibleAdminItems];

  const userInitials = user
    ? (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")
    : "AA";

  const hasAvatar =
    !!user?.profilePicture &&
    user.profilePicture !== "default.png" &&
    (user.profilePicture.startsWith("http://") ||
      user.profilePicture.startsWith("https://"));

  return (
    <motion.aside
      className="relative h-full flex flex-col bg-[#111d2e] border-r border-white/5 select-none shrink-0 z-30"
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-20 -left-10 w-56 h-56 rounded-full bg-accent-blue/10 blur-[90px] pointer-events-none" />

      {/* Logo */}
      <div className="relative flex items-center h-16 px-4 border-b border-white/5 flex-shrink-0">
        <div className="w-9 h-9 bg-accent-blue rounded-xl flex items-center justify-center shadow-lg shadow-accent-blue/20 shrink-0">
          <Anchor className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="ml-3 min-w-0"
            >
              <span className="block text-base font-bold text-white tracking-tight leading-none">
                ANCHOR Africa
              </span>
              <span className="block text-[11px] text-slate-400 mt-0.5 truncate">
                Mental &amp; Behavioral Health
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-brand" aria-label="Main navigation">
        {!sidebarCollapsed && (
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>
        )}
        <ul className="space-y-0.5">
          {allItems.map((item) => {
            const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-accent-blue" />
                  )}
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-accent-blue" : "text-slate-400"}`} />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="truncate flex-1 text-left"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: user card + logout + collapse */}
      <div className="relative border-t border-white/5 p-3 flex-shrink-0 space-y-1">
        {/* Collapsed: avatar-only link to profile */}
        <AnimatePresence>
          {sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                to="/profile"
                title="My Profile"
                className={`w-full flex items-center justify-center p-2 mb-0.5 rounded-xl transition-colors ${
                  location.pathname === "/profile"
                    ? "bg-accent-blue/10"
                    : "hover:bg-white/5"
                }`}
              >
                {hasAvatar ? (
                  <img
                    src={user!.profilePicture}
                    alt={user?.firstName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {userInitials.toUpperCase()}
                  </div>
                )}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded: full user card link to profile */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                to="/profile"
                className={`flex items-center gap-3 px-2 py-2 mb-1 rounded-xl transition-colors ${
                  location.pathname === "/profile"
                    ? "bg-accent-blue/10"
                    : "hover:bg-white/5"
                }`}
              >
                {hasAvatar ? (
                  <img
                    src={user!.profilePicture}
                    alt={user?.firstName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {userInitials.toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user ? `${user.firstName} ${user.lastName}` : "Admin User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate capitalize">{user?.role ?? "user"}</p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button
          onClick={() => setShowLogoutModal(true)}
          title={sidebarCollapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-accent-blue hover:bg-white/5 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { setShowLogoutModal(false); dispatch(logout()); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </motion.aside>
  );
}
