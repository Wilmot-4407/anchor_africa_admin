import React, { Fragment } from 'react';
import {
  SearchIcon,
  BellIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  EyeIcon,
  SaveIcon,
  SendIcon } from
'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
export function Topbar() {
  const {
    activeSection,
    activeSubsection,
    getBreadcrumbs,
    toggleCommandPalette
  } = useNavigation();
  const breadcrumbs = getBreadcrumbs();
  const isWebsiteSection =
  activeSection === 'website' && activeSubsection !== 'overview';
  const showPublishControls = activeSection === 'website';
  const sectionTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    website: 'Website',
    appointments: 'Appointments',
    clients: 'Clients',
    messages: 'Messages',
    analytics: 'Analytics',
    'activity-log': 'Activity Log',
    settings: 'Settings'
  };
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-20">
      {/* Left: Breadcrumb + Title */}
      <div className="flex items-center gap-4 min-w-0">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm">

          {breadcrumbs.map((crumb, i) =>
          <Fragment key={i}>
              {i > 0 &&
            <ChevronRightIcon
              size={14}
              className="text-slate-300 flex-shrink-0" />

            }
              <span
              className={`truncate ${i === breadcrumbs.length - 1 ? 'text-navy-950 font-semibold' : 'text-slate-400 hover:text-slate-600 cursor-pointer transition-colors'}`}>

                {crumb.label}
              </span>
            </Fragment>
          )}
        </nav>

        {isWebsiteSection &&
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Published
          </span>
        }
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Autosave indicator */}
        {showPublishControls &&
        <span className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <CheckCircleIcon size={14} className="text-emerald-500" />
            Saved
          </span>
        }

        {/* Save / Publish */}
        {showPublishControls &&
        <button className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">
            <SendIcon size={15} />
            Publish
          </button>
        }

        {/* Search trigger */}
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 bg-slate-50 border border-border rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open command palette">

          <SearchIcon size={15} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label="Notifications">

          <BellIcon size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User avatar */}
        <button
          className="flex items-center gap-2.5 pl-3 border-l border-border"
          aria-label="User menu">

          <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold">
            DA
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium text-navy-950 leading-tight">
              Dr. Adeyemi
            </p>
            <p className="text-xs text-slate-400 leading-tight">Admin</p>
          </div>
        </button>
      </div>
    </header>);

}