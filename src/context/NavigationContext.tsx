import {
  useCallback,
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Section =
  | "dashboard"
  | "website"
  | "appointments"
  | "clients"
  | "messages"
  | "analytics"
  | "activity-log"
  | "settings";

export type WebsiteSubsection =
  | "overview"
  | "about"
  | "blog"
  | "services"
  | "team"
  | "why-choose-us";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

interface NavigationState {
  activeSection: Section;
  activeSubsection: WebsiteSubsection;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toasts: Toast[];
  websiteExpanded: boolean;
  programsExpanded: boolean;
}

interface NavigationContextType extends NavigationState {
  setActiveSection: (section: Section) => void;
  setActiveSubsection: (sub: WebsiteSubsection) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  setWebsiteExpanded: (expanded: boolean) => void;
  setProgramsExpanded: (expanded: boolean) => void;
  getBreadcrumbs: () => {
    label: string;
    section?: Section;
    subsection?: WebsiteSubsection;
  }[];
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const subsectionLabels: Record<WebsiteSubsection, string> = {
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

// Map URL path segments → sections/subsections
function pathToSection(pathname: string): {
  section: Section;
  subsection: WebsiteSubsection;
} {
  const seg = pathname.split("/").filter(Boolean);
  const first = seg[0] as Section;
  const validSections: Section[] = [
    "dashboard",
    "website",
    "appointments",
    "clients",
    "messages",
    "analytics",
    "activity-log",
    "settings",
  ];
  const validSubsections: WebsiteSubsection[] = [
    "overview",
    "about",
    "blog",
    "services",
    "team",
    "why-choose-us",
  ];

  const section = validSections.includes(first) ? first : "dashboard";

  let subsection: WebsiteSubsection = "overview";
  if (section === "website" && seg[1]) {
    const sub = seg[1] as WebsiteSubsection;
    if (validSubsections.includes(sub)) subsection = sub;
  }

  return { section, subsection };
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive initial state from URL
  const { section: initSection, subsection: initSubsection } = pathToSection(
    location.pathname,
  );

  const [state, setState] = useState<NavigationState>({
    activeSection: initSection,
    activeSubsection: initSubsection,
    sidebarCollapsed: false,
    commandPaletteOpen: false,
    toasts: [],
    websiteExpanded: initSection === "website",
    programsExpanded: false,
  });

  // Keep context in sync when the URL changes externally (browser back/forward)
  useEffect(() => {
    const { section, subsection } = pathToSection(location.pathname);
    setState((prev) => ({
      ...prev,
      activeSection: section,
      activeSubsection: subsection,
      websiteExpanded: section === "website" ? true : prev.websiteExpanded,
    }));
  }, [location.pathname]);

  const setActiveSection = useCallback(
    (section: Section) => {
      setState((prev) => ({
        ...prev,
        activeSection: section,
        activeSubsection:
          section === "website" ? prev.activeSubsection : "overview",
        websiteExpanded: section === "website" ? true : prev.websiteExpanded,
      }));
      // Sync URL
      const routes: Record<Section, string> = {
        dashboard: "/dashboard",
        website: "/website",
        appointments: "/appointments",
        clients: "/clients",
        messages: "/messages",
        analytics: "/analytics",
        "activity-log": "/activity-log",
        settings: "/settings",
      };
      navigate(routes[section]);
    },
    [navigate],
  );

  const setActiveSubsection = useCallback(
    (sub: WebsiteSubsection) => {
      setState((prev) => ({
        ...prev,
        activeSubsection: sub,
        activeSection: "website",
        websiteExpanded: true,
      }));
      // Sync URL: overview goes to /website, others go to /website/<sub>
      if (sub === "overview") {
        navigate("/website");
      } else {
        navigate(`/website/${sub}`);
      }
    },
    [navigate],
  );

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setState((prev) => ({ ...prev, sidebarCollapsed: collapsed }));
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setState((prev) => ({
      ...prev,
      commandPaletteOpen: !prev.commandPaletteOpen,
    }));
  }, []);

  const setCommandPaletteOpen = useCallback((open: boolean) => {
    setState((prev) => ({ ...prev, commandPaletteOpen: open }));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setState((prev) => ({
      ...prev,
      toasts: [...prev.toasts, { ...toast, id }],
    }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        toasts: prev.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((t) => t.id !== id),
    }));
  }, []);

  const setWebsiteExpanded = useCallback((expanded: boolean) => {
    setState((prev) => ({ ...prev, websiteExpanded: expanded }));
  }, []);

  const setProgramsExpanded = useCallback((expanded: boolean) => {
    setState((prev) => ({ ...prev, programsExpanded: expanded }));
  }, []);

  const getBreadcrumbs = useCallback(() => {
    const crumbs: {
      label: string;
      section?: Section;
      subsection?: WebsiteSubsection;
    }[] = [{ label: "Home", section: "dashboard" }];

    if (state.activeSection !== "dashboard") {
      crumbs.push({
        label: sectionLabels[state.activeSection],
        section: state.activeSection,
      });
    }
    if (
      state.activeSection === "website" &&
      state.activeSubsection !== "overview"
    ) {
      crumbs.push({ label: subsectionLabels[state.activeSubsection] });
    }
    return crumbs;
  }, [state.activeSection, state.activeSubsection]);

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        setActiveSection,
        setActiveSubsection,
        toggleSidebar,
        setSidebarCollapsed,
        toggleCommandPalette,
        setCommandPaletteOpen,
        addToast,
        removeToast,
        setWebsiteExpanded,
        setProgramsExpanded,
        getBreadcrumbs,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx)
    throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
