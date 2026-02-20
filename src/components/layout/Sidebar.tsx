import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import {
  LayoutDashboardIcon,
  GlobeIcon,
  CalendarIcon,
  UsersIcon,
  BarChart3Icon,
  ClockIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AnchorIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useNavigation, type Section } from "../../context/NavigationContext";
import { logout } from "../../redux/actions/auth";
import { AppDispatch } from "../../redux/store";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon size={20} />,
  },
  {
    id: "website",
    label: "Website",
    icon: <GlobeIcon size={20} />,
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: <CalendarIcon size={20} />,
  },
  {
    id: "clients",
    label: "Clients",
    icon: <UsersIcon size={20} />,
  },
  {
    id: "messages",
    label: "Messages",
    icon: <MessageSquareIcon size={20} />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3Icon size={20} />,
  },
  {
    id: "activity-log",
    label: "Activity Log",
    icon: <ClockIcon size={20} />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon size={20} />,
  },
];

export function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { activeSection, sidebarCollapsed, toggleSidebar, setActiveSection } =
    useNavigation();

  const handleNavClick = (item: NavItem) => {
    setActiveSection(item.id);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <motion.aside
      className="h-full bg-navy-950 flex flex-col relative z-30 select-none"
      animate={{ width: sidebarCollapsed ? 72 : 264 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
            <AnchorIcon size={18} className="text-navy-950" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-white font-semibold text-base tracking-tight whitespace-nowrap overflow-hidden"
              >
                ANCHOR
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3"
        aria-label="Main navigation"
      >
        <ul className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative group
                    ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-r-full"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <span className="flex-shrink-0">{item.icon}</span>
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
                    <span className="ml-auto bg-amber-500 text-navy-950 text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-3 flex-shrink-0 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={sidebarCollapsed ? "Logout" : undefined}
        >
          <LogOutIcon size={20} className="flex-shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon size={18} />
          ) : (
            <ChevronLeftIcon size={18} />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
