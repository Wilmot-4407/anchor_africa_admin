import { Fragment } from "react";
import { useSelector } from "react-redux";
import { BellIcon, ChevronRightIcon } from "lucide-react";
import { RootState } from "../../redux/store";
import {
  useNavigation,
  type Section,
  type WebsiteSubsection,
} from "../../context/NavigationContext";

const subsectionLabels: Record<WebsiteSubsection, string> = {
  overview: "Website",
  about: "About ANCHOR",
  blog: "Blog",
  services: "Services",
  team: "Team",
  "why-choose-us": "Why Choose Us",
};

const sectionLabels: Record<Section, string> = {
  dashboard: "Dashboard",
  website: "Website",
  appointments: "Appointments",
  clients: "Clients",
  messages: "Messages",
  analytics: "Analytics",
  users: "User Management",
  "activity-log": "Activity Log",
  settings: "Settings",
};

export function Topbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    activeSection,
    activeSubsection,
    setActiveSection,
    setActiveSubsection,
  } = useNavigation();

  const initials = user
    ? (user.firstName[0] + user.lastName[0]).toUpperCase()
    : "AA";

  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    { label: "Home", onClick: () => setActiveSection("dashboard") },
  ];

  if (activeSection !== "dashboard") {
    breadcrumbs.push({
      label: sectionLabels[activeSection],
      onClick:
        activeSection === "website"
          ? () => setActiveSubsection("overview")
          : undefined,
    });
  }

  if (activeSection === "website" && activeSubsection !== "overview") {
    breadcrumbs.push({ label: subsectionLabels[activeSubsection] });
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-20">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm min-w-0"
      >
        {breadcrumbs.map((crumb, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <ChevronRightIcon
                size={14}
                className="text-slate-300 flex-shrink-0"
              />
            )}
            <span
              onClick={crumb.onClick}
              className={`truncate transition-colors ${
                i === breadcrumbs.length - 1
                  ? "text-primary font-bold"
                  : crumb.onClick
                    ? "text-slate-400 hover:text-primary cursor-pointer font-medium"
                    : "text-slate-400 font-medium"
              }`}
            >
              {crumb.label}
            </span>
          </Fragment>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative p-2 text-slate-400 hover:text-primary hover:bg-primary/8 rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <BellIcon size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {initials}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p className="text-xs text-slate-400 leading-tight capitalize">
              {user?.role || "User"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
