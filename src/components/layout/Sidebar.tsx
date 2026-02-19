import React, { Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboardIcon,
  GlobeIcon,
  CalendarIcon,
  UsersIcon,
  MessageSquareIcon,
  BarChart3Icon,
  ClockIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  AnchorIcon,
  FileTextIcon,
  HeartIcon,
  EyeIcon,
  ShieldIcon,
  BookOpenIcon,
  BrainIcon,
  GraduationCapIcon,
  StethoscopeIcon,
  ClipboardListIcon,
  HandshakeIcon,
  ActivityIcon,
  VideoIcon,
  MegaphoneIcon,
  LightbulbIcon,
  CalendarDaysIcon,
  BookIcon,
  StarIcon,
  UsersRoundIcon,
  ImageIcon,
  PhoneIcon,
  PanelBottomIcon } from
'lucide-react';
import {
  useNavigation,
  type Section,
  type WebsiteSubsection } from
'../../context/NavigationContext';
interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}
interface WebsiteSubItem {
  id: WebsiteSubsection;
  label: string;
  icon: React.ReactNode;
  children?: {
    id: WebsiteSubsection;
    label: string;
    icon: React.ReactNode;
  }[];
}
const mainNavItems: NavItem[] = [
{
  id: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboardIcon size={20} />
},
{
  id: 'website',
  label: 'Website',
  icon: <GlobeIcon size={20} />
},
{
  id: 'appointments',
  label: 'Appointments',
  icon: <CalendarIcon size={20} />
},
{
  id: 'clients',
  label: 'Clients',
  icon: <UsersIcon size={20} />
},
{
  id: 'messages',
  label: 'Messages',
  icon: <MessageSquareIcon size={20} />,
  badge: '3'
},
{
  id: 'analytics',
  label: 'Analytics',
  icon: <BarChart3Icon size={20} />
},
{
  id: 'activity-log',
  label: 'Activity Log',
  icon: <ClockIcon size={20} />
},
{
  id: 'settings',
  label: 'Settings',
  icon: <SettingsIcon size={20} />
}];

const websiteSubItems: WebsiteSubItem[] = [
{
  id: 'hero',
  label: 'Hero Section',
  icon: <FileTextIcon size={16} />
},
{
  id: 'about',
  label: 'About ANCHOR',
  icon: <HeartIcon size={16} />
},
{
  id: 'mission-vision',
  label: 'Mission & Vision',
  icon: <EyeIcon size={16} />
},
{
  id: 'core-values',
  label: 'Core Values',
  icon: <ShieldIcon size={16} />
},
{
  id: 'programs',
  label: 'Programs',
  icon: <BookOpenIcon size={16} />,
  children: [
  {
    id: 'programs-mental-health',
    label: 'Mental & Behavioral Health',
    icon: <BrainIcon size={14} />
  },
  {
    id: 'programs-institute',
    label: 'Institute of Mental Health',
    icon: <GraduationCapIcon size={14} />
  }]

},
{
  id: 'clinical-services',
  label: 'Clinical Services',
  icon: <StethoscopeIcon size={16} />
},
{
  id: 'assessment-services',
  label: 'Assessment Services',
  icon: <ClipboardListIcon size={16} />
},
{
  id: 'counseling',
  label: 'Counseling & Psychotherapy',
  icon: <HandshakeIcon size={16} />
},
{
  id: 'specialized-treatment',
  label: 'Specialized Treatment',
  icon: <ActivityIcon size={16} />
},
{
  id: 'telehealth',
  label: 'Telehealth Services',
  icon: <VideoIcon size={16} />
},
{
  id: 'community-outreach',
  label: 'Community Outreach',
  icon: <MegaphoneIcon size={16} />
},
{
  id: 'research-innovation',
  label: 'Research & Innovation',
  icon: <LightbulbIcon size={16} />
},
{
  id: 'conferences-events',
  label: 'Conferences & Events',
  icon: <CalendarDaysIcon size={16} />
},
{
  id: 'courses',
  label: 'Courses',
  icon: <BookIcon size={16} />
},
{
  id: 'blog',
  label: 'Blog',
  icon: <FileTextIcon size={16} />
},
{
  id: 'testimonials',
  label: 'Testimonials',
  icon: <StarIcon size={16} />
},
{
  id: 'team',
  label: 'Team',
  icon: <UsersRoundIcon size={16} />
},
{
  id: 'media-library',
  label: 'Media Library',
  icon: <ImageIcon size={16} />
},
{
  id: 'contact',
  label: 'Contact Information',
  icon: <PhoneIcon size={16} />
},
{
  id: 'footer',
  label: 'Footer',
  icon: <PanelBottomIcon size={16} />
}];

export function Sidebar() {
  const {
    activeSection,
    activeSubsection,
    sidebarCollapsed,
    toggleSidebar,
    setActiveSection,
    setActiveSubsection,
    websiteExpanded,
    setWebsiteExpanded,
    programsExpanded,
    setProgramsExpanded
  } = useNavigation();
  const handleNavClick = (item: NavItem) => {
    if (item.id === 'website') {
      if (!sidebarCollapsed) {
        setWebsiteExpanded(!websiteExpanded);
      }
      setActiveSection('website');
    } else {
      setActiveSection(item.id);
    }
  };
  const handleSubClick = (sub: WebsiteSubItem) => {
    if (sub.children) {
      setProgramsExpanded(!programsExpanded);
    }
    setActiveSubsection(sub.id);
  };
  return (
    <motion.aside
      className="h-full bg-navy-950 flex flex-col relative z-30 select-none"
      animate={{
        width: sidebarCollapsed ? 72 : 280
      }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1]
      }}>

      {/* Logo */}
      <div className="flex items-center h-16 px-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <AnchorIcon size={18} className="text-navy-950" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed &&
            <motion.span
              initial={{
                opacity: 0,
                width: 0
              }}
              animate={{
                opacity: 1,
                width: 'auto'
              }}
              exit={{
                opacity: 0,
                width: 0
              }}
              transition={{
                duration: 0.2
              }}
              className="text-white font-semibold text-base tracking-tight whitespace-nowrap overflow-hidden">

                ANCHOR
              </motion.span>
            }
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3"
        aria-label="Main navigation">

        <ul className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive = activeSection === item.id;
            const isWebsite = item.id === 'website';
            const showWebsiteSubs =
            isWebsite && websiteExpanded && !sidebarCollapsed;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 relative group
                    ${isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  title={sidebarCollapsed ? item.label : undefined}>

                  {isActive &&
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full"
                    transition={{
                      duration: 0.2
                    }} />

                  }
                  <span className="flex-shrink-0">{item.icon}</span>
                  <AnimatePresence>
                    {!sidebarCollapsed &&
                    <motion.span
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
                      className="truncate flex-1 text-left">

                        {item.label}
                      </motion.span>
                    }
                  </AnimatePresence>
                  {!sidebarCollapsed && item.badge &&
                  <span className="ml-auto bg-accent text-navy-950 text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  }
                  {!sidebarCollapsed && isWebsite &&
                  <motion.span
                    animate={{
                      rotate: websiteExpanded ? 180 : 0
                    }}
                    transition={{
                      duration: 0.2
                    }}
                    className="ml-auto flex-shrink-0">

                      <ChevronDownIcon size={14} className="text-slate-500" />
                    </motion.span>
                  }
                  {sidebarCollapsed && item.badge &&
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                  }
                </button>

                {/* Website sub-items */}
                <AnimatePresence>
                  {showWebsiteSubs &&
                  <motion.ul
                    initial={{
                      height: 0,
                      opacity: 0
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1
                    }}
                    exit={{
                      height: 0,
                      opacity: 0
                    }}
                    transition={{
                      duration: 0.25,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="overflow-hidden ml-4 mt-1 border-l border-white/10 pl-0">

                      {websiteSubItems.map((sub) => {
                      const isSubActive =
                      activeSection === 'website' &&
                      activeSubsection === sub.id;
                      const hasChildren = !!sub.children;
                      const showChildren = hasChildren && programsExpanded;
                      return (
                        <li key={sub.id}>
                            <button
                            onClick={() => handleSubClick(sub)}
                            className={`
                                w-full flex items-center gap-2.5 pl-3 pr-3 py-1.5 text-xs font-medium transition-colors duration-150 rounded-r-md
                                ${isSubActive ? 'text-accent bg-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                              `}>

                              <span className="flex-shrink-0 opacity-70">
                                {sub.icon}
                              </span>
                              <span className="truncate flex-1 text-left">
                                {sub.label}
                              </span>
                              {hasChildren &&
                            <motion.span
                              animate={{
                                rotate: showChildren ? 180 : 0
                              }}
                              transition={{
                                duration: 0.2
                              }}>

                                  <ChevronDownIcon
                                size={12}
                                className="text-slate-600" />

                                </motion.span>
                            }
                            </button>
                            <AnimatePresence>
                              {showChildren && sub.children &&
                            <motion.ul
                              initial={{
                                height: 0,
                                opacity: 0
                              }}
                              animate={{
                                height: 'auto',
                                opacity: 1
                              }}
                              exit={{
                                height: 0,
                                opacity: 0
                              }}
                              transition={{
                                duration: 0.2
                              }}
                              className="overflow-hidden ml-4 border-l border-white/10">

                                  {sub.children.map((child) => {
                                const isChildActive =
                                activeSubsection === child.id;
                                return (
                                  <li key={child.id}>
                                        <button
                                      onClick={() =>
                                      setActiveSubsection(child.id)
                                      }
                                      className={`
                                            w-full flex items-center gap-2 pl-3 pr-3 py-1.5 text-xs transition-colors duration-150 rounded-r-md
                                            ${isChildActive ? 'text-accent bg-white/5 font-medium' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
                                          `}>

                                          <span className="flex-shrink-0 opacity-60">
                                            {child.icon}
                                          </span>
                                          <span className="truncate">
                                            {child.label}
                                          </span>
                                        </button>
                                      </li>);

                              })}
                                </motion.ul>
                            }
                            </AnimatePresence>
                          </li>);

                    })}
                    </motion.ul>
                  }
                </AnimatePresence>
              </li>);

          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/10 p-3 flex-shrink-0 space-y-1">
        <button
          onClick={() => setActiveSection('settings')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">

          <LogOutIcon size={20} />
          <AnimatePresence>
            {!sidebarCollapsed &&
            <motion.span
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              className="truncate">

                Logout
              </motion.span>
            }
          </AnimatePresence>
        </button>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>

          {sidebarCollapsed ?
          <ChevronRightIcon size={18} /> :

          <ChevronLeftIcon size={18} />
          }
        </button>
      </div>
    </motion.aside>);

}