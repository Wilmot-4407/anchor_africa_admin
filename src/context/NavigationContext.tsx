import React, { useCallback, useState, createContext, useContext } from 'react';
export type Section =
'dashboard' |
'website' |
'appointments' |
'clients' |
'messages' |
'analytics' |
'activity-log' |
'settings';
export type WebsiteSubsection =
'overview' |
'hero' |
'about' |
'mission-vision' |
'core-values' |
'programs' |
'programs-mental-health' |
'programs-institute' |
'clinical-services' |
'assessment-services' |
'counseling' |
'specialized-treatment' |
'telehealth' |
'community-outreach' |
'research-innovation' |
'conferences-events' |
'courses' |
'blog' |
'testimonials' |
'team' |
'media-library' |
'contact' |
'footer';
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
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
  addToast: (toast: Omit<Toast, 'id'>) => void;
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
const subsectionLabels: Record<WebsiteSubsection, string> = {
  overview: 'Overview',
  hero: 'Hero Section',
  about: 'About ANCHOR',
  'mission-vision': 'Mission & Vision',
  'core-values': 'Core Values',
  programs: 'Programs',
  'programs-mental-health': 'Mental & Behavioral Health Clinic',
  'programs-institute': 'Institute of Mental Health',
  'clinical-services': 'Clinical Services',
  'assessment-services': 'Assessment Services',
  counseling: 'Counseling & Psychotherapy',
  'specialized-treatment': 'Specialized Treatment Programs',
  telehealth: 'Telehealth Services',
  'community-outreach': 'Community Outreach & Advocacy',
  'research-innovation': 'Research, Innovation & Consultancy',
  'conferences-events': 'Conferences & Events',
  courses: 'Courses',
  blog: 'Blog',
  testimonials: 'Testimonials',
  team: 'Team',
  'media-library': 'Media Library',
  contact: 'Contact Information',
  footer: 'Footer'
};
const sectionLabels: Record<Section, string> = {
  dashboard: 'Dashboard',
  website: 'Website',
  appointments: 'Appointments',
  clients: 'Clients',
  messages: 'Messages',
  analytics: 'Analytics',
  'activity-log': 'Activity Log',
  settings: 'Settings'
};
export function NavigationProvider({ children }: {children: ReactNode;}) {
  const [state, setState] = useState<NavigationState>({
    activeSection: 'dashboard',
    activeSubsection: 'overview',
    sidebarCollapsed: false,
    commandPaletteOpen: false,
    toasts: [],
    websiteExpanded: false,
    programsExpanded: false
  });
  const setActiveSection = useCallback((section: Section) => {
    setState((prev) => ({
      ...prev,
      activeSection: section,
      activeSubsection:
      section === 'website' ? prev.activeSubsection : 'overview',
      websiteExpanded: section === 'website' ? true : prev.websiteExpanded
    }));
  }, []);
  const setActiveSubsection = useCallback((sub: WebsiteSubsection) => {
    setState((prev) => ({
      ...prev,
      activeSubsection: sub,
      activeSection: 'website'
    }));
  }, []);
  const toggleSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  }, []);
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setState((prev) => ({
      ...prev,
      sidebarCollapsed: collapsed
    }));
  }, []);
  const toggleCommandPalette = useCallback(() => {
    setState((prev) => ({
      ...prev,
      commandPaletteOpen: !prev.commandPaletteOpen
    }));
  }, []);
  const setCommandPaletteOpen = useCallback((open: boolean) => {
    setState((prev) => ({
      ...prev,
      commandPaletteOpen: open
    }));
  }, []);
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setState((prev) => ({
      ...prev,
      toasts: [
      ...prev.toasts,
      {
        ...toast,
        id
      }]

    }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        toasts: prev.toasts.filter((t) => t.id !== id)
      }));
    }, 4000);
  }, []);
  const removeToast = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((t) => t.id !== id)
    }));
  }, []);
  const setWebsiteExpanded = useCallback((expanded: boolean) => {
    setState((prev) => ({
      ...prev,
      websiteExpanded: expanded
    }));
  }, []);
  const setProgramsExpanded = useCallback((expanded: boolean) => {
    setState((prev) => ({
      ...prev,
      programsExpanded: expanded
    }));
  }, []);
  const getBreadcrumbs = useCallback(() => {
    const crumbs: {
      label: string;
      section?: Section;
      subsection?: WebsiteSubsection;
    }[] = [
    {
      label: 'Home',
      section: 'dashboard'
    }];

    if (state.activeSection !== 'dashboard') {
      crumbs.push({
        label: sectionLabels[state.activeSection],
        section: state.activeSection
      });
    }
    if (
    state.activeSection === 'website' &&
    state.activeSubsection !== 'overview')
    {
      crumbs.push({
        label: subsectionLabels[state.activeSubsection]
      });
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
        getBreadcrumbs
      }}>

      {children}
    </NavigationContext.Provider>);

}
export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx)
  throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}