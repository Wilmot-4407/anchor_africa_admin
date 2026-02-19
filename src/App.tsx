import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/layout/ToastContainer';
import { DashboardView } from './pages/DashboardView';
import { WebsiteEditor } from './pages/WebsiteEditor';
import { AppointmentsView } from './pages/AppointmentsView';
import { ClientsView } from './pages/ClientsView';
import { MessagesView } from './pages/MessagesView';
import { AnalyticsView } from './pages/AnalyticsView';
import { ActivityLogView } from './pages/ActivityLogView';
import { SettingsView } from './pages/SettingsView';
function AppShell() {
  const { activeSection, toggleCommandPalette } = useNavigation();
  // CMD+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);
  const renderView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'website':
        return <WebsiteEditor />;
      case 'appointments':
        return <AppointmentsView />;
      case 'clients':
        return <ClientsView />;
      case 'messages':
        return <MessagesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'activity-log':
        return <ActivityLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };
  return (
    <div className="h-screen w-full flex overflow-hidden bg-stone-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{
                opacity: 0,
                y: 6
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -6
              }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="h-full">

              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Overlays */}
      <CommandPalette />
      <ToastContainer />
    </div>);

}
export function App() {
  return (
    <NavigationProvider>
      <AppShell />
    </NavigationProvider>);

}