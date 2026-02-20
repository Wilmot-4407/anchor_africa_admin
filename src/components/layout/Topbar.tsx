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

  // Build breadcrumbs from navigation context
  const breadcrumbs: { label: string; onClick?: () => void }[] = [
    {
      label: "Home",
      onClick: () => setActiveSection("dashboard"),
    },
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
    breadcrumbs.push({
      label: subsectionLabels[activeSubsection],
    });
  }

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-20">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm"
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
                    ? "text-navy-950 font-semibold"
                    : crumb.onClick
                      ? "text-slate-400 hover:text-slate-600 cursor-pointer"
                      : "text-slate-400"
                }`}
              >
                {crumb.label}
              </span>
            </Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label="Notifications"
        >
          <BellIcon size={20} />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-navy-950 leading-tight">
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
