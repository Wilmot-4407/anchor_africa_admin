import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboardIcon,
  GlobeIcon,
  CalendarIcon,
  UsersIcon,
  BarChart3Icon,
  ClockIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageSquareIcon,
  UserCogIcon,
  AlertTriangle,
} from "lucide-react";
import { useNavigation, type Section } from "../../context/NavigationContext";
import { logout } from "../../redux/actions/auth";
import { AppDispatch, RootState } from "../../redux/store";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
}

const mainNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon size={20} />,
  },
  { id: "website", label: "Website", icon: <GlobeIcon size={20} /> },
  {
    id: "appointments",
    label: "Appointments",
    icon: <CalendarIcon size={20} />,
  },
  { id: "clients", label: "Clients", icon: <UsersIcon size={20} /> },
  { id: "messages", label: "Messages", icon: <MessageSquareIcon size={20} /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3Icon size={20} /> },
  {
    id: "users",
    label: "User Management",
    icon: <UserCogIcon size={20} />,
    adminOnly: true,
  },
  {
    id: "activity-log",
    label: "Activity Log",
    icon: <ClockIcon size={20} />,
    adminOnly: true,
  },
  { id: "profile", label: "Profile", icon: <UserCogIcon size={20} /> },
];

// ── Logout Confirmation Modal ─────────────────────────────────────────────────
function LogoutModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10"
      >
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 text-center">
          Sign Out
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2">
          Are you sure you want to sign out of the admin portal?
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
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
  const { activeSection, sidebarCollapsed, toggleSidebar, setActiveSection } =
    useNavigation();

  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const visibleNavItems = mainNavItems.filter(
    (item) => !item.adminOnly || isAdmin,
  );

  return (
    <motion.aside
      style={{ background: "#023d3e" }}
      className="h-full flex flex-col relative z-30 select-none"
      animate={{ width: sidebarCollapsed ? 72 : 264 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center h-16 px-4 flex-shrink-0 border-b border-primary/20">
        <AnimatePresence mode="wait">
          {sidebarCollapsed ? (
            <motion.img
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              src="/assets/images/logo/logo.png"
              alt="Anchor Africa Logo"
              className="w-9 h-9 object-contain"
            />
          ) : (
            <motion.img
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src="/assets/images/logo/logo.png"
              alt="Anchor Africa Logo"
              className="h-9 max-w-[160px] object-contain"
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3"
        aria-label="Main navigation"
      >
        <ul className="space-y-0.5">
          {visibleNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-150 relative group
                    ${
                      isActive
                        ? "text-white bg-secondary/90"
                        : "text-white/50 hover:text-white hover:bg-white/6"
                    }
                  `}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-0 bottom-0 my-auto w-[3px] h-6 rounded-r-full bg-black"
                      style={{ boxShadow: "0 0 8px 2px rgba(0,0,0,0.55)" }}
                    />
                  )}

                  <span
                    className={`flex-shrink-0 ${isActive ? "text-black" : "text-white/40 group-hover:text-white"}`}
                  >
                    {item.icon}
                  </span>

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

                  {!sidebarCollapsed && item.badge && (
                    <span className="ml-auto bg-secondary text-[#023d3e] text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}

                  {item.adminOnly && sidebarCollapsed && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-secondary/80" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Bottom ── */}
      <div className="border-t border-primary/20 p-3 flex-shrink-0 space-y-1">
        <button
          onClick={() => setShowLogoutModal(true)}
          title={sidebarCollapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/45 hover:text-white hover:bg-white/6 transition-colors"
        >
          <LogOutIcon size={20} className="flex-shrink-0" />
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

        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="w-full flex items-center justify-center p-2 rounded-xl text-white/35 hover:text-primary-light hover:bg-white/6 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon size={18} />
          ) : (
            <ChevronLeftIcon size={18} />
          )}
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            dispatch(logout());
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </motion.aside>
  );
}
