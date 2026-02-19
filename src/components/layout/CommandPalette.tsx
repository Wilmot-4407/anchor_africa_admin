import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  FileTextIcon,
  CalendarIcon,
  ImageIcon,
  BarChart3Icon,
  UsersIcon,
  SettingsIcon,
  ArrowRightIcon,
  LayoutDashboardIcon,
  GlobeIcon,
  MessageSquareIcon,
  ClockIcon,
  HashIcon } from
'lucide-react';
import {
  useNavigation,
  type Section,
  type WebsiteSubsection } from
'../../context/NavigationContext';
interface CommandItem {
  id: string;
  label: string;
  group: 'pages' | 'actions' | 'recent';
  icon: React.ReactNode;
  section?: Section;
  subsection?: WebsiteSubsection;
}
const commands: CommandItem[] = [
{
  id: 'dashboard',
  label: 'Dashboard',
  group: 'pages',
  icon: <LayoutDashboardIcon size={16} />,
  section: 'dashboard'
},
{
  id: 'website',
  label: 'Website Overview',
  group: 'pages',
  icon: <GlobeIcon size={16} />,
  section: 'website'
},
{
  id: 'blog',
  label: 'Blog Manager',
  group: 'pages',
  icon: <FileTextIcon size={16} />,
  section: 'website',
  subsection: 'blog'
},
{
  id: 'team',
  label: 'Team Management',
  group: 'pages',
  icon: <UsersIcon size={16} />,
  section: 'website',
  subsection: 'team'
},
{
  id: 'media',
  label: 'Media Library',
  group: 'pages',
  icon: <ImageIcon size={16} />,
  section: 'website',
  subsection: 'media-library'
},
{
  id: 'appointments',
  label: 'Appointments',
  group: 'pages',
  icon: <CalendarIcon size={16} />,
  section: 'appointments'
},
{
  id: 'clients',
  label: 'Clients',
  group: 'pages',
  icon: <UsersIcon size={16} />,
  section: 'clients'
},
{
  id: 'messages',
  label: 'Messages',
  group: 'pages',
  icon: <MessageSquareIcon size={16} />,
  section: 'messages'
},
{
  id: 'analytics',
  label: 'Analytics',
  group: 'pages',
  icon: <BarChart3Icon size={16} />,
  section: 'analytics'
},
{
  id: 'activity',
  label: 'Activity Log',
  group: 'pages',
  icon: <ClockIcon size={16} />,
  section: 'activity-log'
},
{
  id: 'settings',
  label: 'Settings',
  group: 'pages',
  icon: <SettingsIcon size={16} />,
  section: 'settings'
},
{
  id: 'new-post',
  label: 'New Blog Post',
  group: 'actions',
  icon: <FileTextIcon size={16} />,
  section: 'website',
  subsection: 'blog'
},
{
  id: 'new-appointment',
  label: 'New Appointment',
  group: 'actions',
  icon: <CalendarIcon size={16} />,
  section: 'appointments'
},
{
  id: 'upload-media',
  label: 'Upload Media',
  group: 'actions',
  icon: <ImageIcon size={16} />,
  section: 'website',
  subsection: 'media-library'
},
{
  id: 'view-analytics',
  label: 'View Analytics',
  group: 'actions',
  icon: <BarChart3Icon size={16} />,
  section: 'analytics'
}];

const groupLabels: Record<string, string> = {
  pages: 'Pages',
  actions: 'Quick Actions',
  recent: 'Recent'
};
export function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setActiveSection,
    setActiveSubsection
  } = useNavigation();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = commands.filter((cmd) =>
  cmd.label.toLowerCase().includes(query.toLowerCase())
  );
  const grouped = filtered.reduce<Record<string, CommandItem[]>>(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {}
  );
  const flatFiltered = Object.values(grouped).flat();
  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      if (cmd.section) setActiveSection(cmd.section);
      if (cmd.subsection) setActiveSubsection(cmd.subsection);
      setCommandPaletteOpen(false);
      setQuery('');
      setSelectedIndex(0);
    },
    [setActiveSection, setActiveSubsection, setCommandPaletteOpen]
  );
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatFiltered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && flatFiltered[selectedIndex]) {
        e.preventDefault();
        executeCommand(flatFiltered[selectedIndex]);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
  commandPaletteOpen,
  flatFiltered,
  selectedIndex,
  executeCommand,
  setCommandPaletteOpen]
  );
  let runningIndex = 0;
  return (
    <AnimatePresence>
      {commandPaletteOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        transition={{
          duration: 0.15
        }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        onClick={() => {
          setCommandPaletteOpen(false);
          setQuery('');
        }}>

          {/* Backdrop */}
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" />

          {/* Palette */}
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: -10
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: -10
          }}
          transition={{
            duration: 0.15,
            ease: [0.4, 0, 0.2, 1]
          }}
          className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-border overflow-hidden"
          onClick={(e) => e.stopPropagation()}>

            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <SearchIcon size={18} className="text-slate-400 flex-shrink-0" />
              <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, actions..."
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400 text-navy-950" />

              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {flatFiltered.length === 0 ?
            <div className="px-4 py-8 text-center text-sm text-slate-400">
                  <HashIcon size={24} className="mx-auto mb-2 text-slate-300" />
                  No results found
                </div> :

            Object.entries(grouped).map(([group, items]) =>
            <div key={group}>
                    <p className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {groupLabels[group] || group}
                    </p>
                    {items.map((cmd) => {
                const idx = runningIndex++;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isSelected ? 'bg-slate-50 text-navy-950' : 'text-slate-600 hover:bg-slate-50'}`}>

                          <span
                      className={
                      isSelected ? 'text-accent' : 'text-slate-400'
                      }>

                            {cmd.icon}
                          </span>
                          <span className="flex-1 text-left font-medium">
                            {cmd.label}
                          </span>
                          {isSelected &&
                    <ArrowRightIcon
                      size={14}
                      className="text-slate-400" />

                    }
                        </button>);

              })}
                  </div>
            )
            }
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">
                  ↑↓
                </kbd>{' '}
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">
                  ↵
                </kbd>{' '}
                Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px]">
                  esc
                </kbd>{' '}
                Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}