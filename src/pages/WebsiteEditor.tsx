import React, { Children } from 'react';
import { motion } from 'framer-motion';
import {
  FileTextIcon,
  HeartIcon,
  EyeIcon,
  ShieldIcon,
  BookOpenIcon,
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
  PanelBottomIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon } from
'lucide-react';
import {
  useNavigation,
  type WebsiteSubsection } from
'../context/NavigationContext';
import { HeroEditor } from '../components/website/HeroEditor';
import { BlogManager } from '../components/website/BlogManager';
import { TeamManager } from '../components/website/TeamManager';
import { TestimonialsManager } from '../components/website/TestimonialsManager';
import { MediaLibrary } from '../components/website/MediaLibrary';
interface SectionCard {
  id: WebsiteSubsection;
  label: string;
  icon: React.ReactNode;
  lastEdited: string;
  status: 'published' | 'draft';
}
const sectionCards: SectionCard[] = [
{
  id: 'hero',
  label: 'Hero Section',
  icon: <FileTextIcon size={20} />,
  lastEdited: '2 hours ago',
  status: 'published'
},
{
  id: 'about',
  label: 'About ANCHOR',
  icon: <HeartIcon size={20} />,
  lastEdited: '1 day ago',
  status: 'published'
},
{
  id: 'mission-vision',
  label: 'Mission & Vision',
  icon: <EyeIcon size={20} />,
  lastEdited: '3 days ago',
  status: 'published'
},
{
  id: 'core-values',
  label: 'Core Values',
  icon: <ShieldIcon size={20} />,
  lastEdited: '1 week ago',
  status: 'published'
},
{
  id: 'programs',
  label: 'Programs',
  icon: <BookOpenIcon size={20} />,
  lastEdited: '5 days ago',
  status: 'published'
},
{
  id: 'clinical-services',
  label: 'Clinical Services',
  icon: <StethoscopeIcon size={20} />,
  lastEdited: '2 days ago',
  status: 'published'
},
{
  id: 'assessment-services',
  label: 'Assessment Services',
  icon: <ClipboardListIcon size={20} />,
  lastEdited: '4 days ago',
  status: 'published'
},
{
  id: 'counseling',
  label: 'Counseling & Psychotherapy',
  icon: <HandshakeIcon size={20} />,
  lastEdited: '1 day ago',
  status: 'published'
},
{
  id: 'specialized-treatment',
  label: 'Specialized Treatment',
  icon: <ActivityIcon size={20} />,
  lastEdited: '6 days ago',
  status: 'draft'
},
{
  id: 'telehealth',
  label: 'Telehealth Services',
  icon: <VideoIcon size={20} />,
  lastEdited: '3 days ago',
  status: 'published'
},
{
  id: 'community-outreach',
  label: 'Community Outreach',
  icon: <MegaphoneIcon size={20} />,
  lastEdited: '1 week ago',
  status: 'published'
},
{
  id: 'research-innovation',
  label: 'Research & Innovation',
  icon: <LightbulbIcon size={20} />,
  lastEdited: '2 weeks ago',
  status: 'draft'
},
{
  id: 'conferences-events',
  label: 'Conferences & Events',
  icon: <CalendarDaysIcon size={20} />,
  lastEdited: '4 days ago',
  status: 'published'
},
{
  id: 'courses',
  label: 'Courses',
  icon: <BookIcon size={20} />,
  lastEdited: '1 day ago',
  status: 'published'
},
{
  id: 'blog',
  label: 'Blog',
  icon: <FileTextIcon size={20} />,
  lastEdited: '30 min ago',
  status: 'published'
},
{
  id: 'testimonials',
  label: 'Testimonials',
  icon: <StarIcon size={20} />,
  lastEdited: '2 days ago',
  status: 'published'
},
{
  id: 'team',
  label: 'Team',
  icon: <UsersRoundIcon size={20} />,
  lastEdited: '1 day ago',
  status: 'published'
},
{
  id: 'media-library',
  label: 'Media Library',
  icon: <ImageIcon size={20} />,
  lastEdited: '1 hour ago',
  status: 'published'
},
{
  id: 'contact',
  label: 'Contact Information',
  icon: <PhoneIcon size={20} />,
  lastEdited: '1 week ago',
  status: 'published'
},
{
  id: 'footer',
  label: 'Footer',
  icon: <PanelBottomIcon size={20} />,
  lastEdited: '2 weeks ago',
  status: 'published'
}];

const stagger = {
  hidden: {
    opacity: 0
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};
export function WebsiteEditor() {
  const { activeSubsection, setActiveSubsection } = useNavigation();
  // Render sub-editors based on active subsection
  if (activeSubsection === 'hero') return <HeroEditor />;
  if (activeSubsection === 'blog') return <BlogManager />;
  if (activeSubsection === 'team') return <TeamManager />;
  if (activeSubsection === 'testimonials') return <TestimonialsManager />;
  if (activeSubsection === 'media-library') return <MediaLibrary />;
  // For other subsections, show a generic editor placeholder
  if (activeSubsection !== 'overview') {
    return <GenericSectionEditor subsection={activeSubsection} />;
  }
  // Overview grid
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="p-8 max-w-7xl mx-auto">

      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-semibold text-navy-950">Website</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage all sections of the ANCHOR website
        </p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {sectionCards.map((card) =>
        <motion.button
          key={card.id}
          variants={fadeUp}
          whileHover={{
            y: -2
          }}
          transition={{
            duration: 0.15
          }}
          onClick={() => setActiveSubsection(card.id)}
          className="bg-white rounded-xl border border-border p-5 text-left hover:shadow-md hover:border-slate-300 transition-shadow group">

            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-accent group-hover:bg-amber-50 transition-colors">
                {card.icon}
              </div>
              <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${card.status === 'published' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>

                {card.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-navy-950 mb-1">
              {card.label}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ClockIcon size={10} /> Edited {card.lastEdited}
            </p>
          </motion.button>
        )}
      </motion.div>
    </motion.div>);

}
function GenericSectionEditor({
  subsection


}: {subsection: WebsiteSubsection;}) {
  const subsectionLabels: Record<string, string> = {
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
    contact: 'Contact Information',
    footer: 'Footer'
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3
      }}
      className="p-8 max-w-3xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy-950">
          {subsectionLabels[subsection] || subsection}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Edit the content for this section
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-6 space-y-8">
          {/* Section Content */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
              <FileTextIcon size={14} className="text-accent" />
              Section Content
            </legend>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                defaultValue={subsectionLabels[subsection] || ''}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                placeholder="Enter a subtitle..."
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Body Content
              </label>
              <textarea
                rows={10}
                placeholder="Enter section content..."
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />

            </div>
          </fieldset>

          <hr className="border-border" />

          {/* Media */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
              <ImageIcon size={14} className="text-accent" />
              Media
            </legend>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/40 transition-colors cursor-pointer">
                <ImageIcon size={24} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Image Alt Text
              </label>
              <input
                type="text"
                placeholder="Describe the image for accessibility..."
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

            </div>
          </fieldset>

          <hr className="border-border" />

          {/* Visibility & SEO */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-semibold text-navy-950 uppercase tracking-wider mb-1">
              <EyeIcon size={14} className="text-accent" />
              Visibility & SEO
            </legend>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-navy-950">
                  Section Visibility
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Show this section on the live website
                </p>
              </div>
              <button className="relative w-11 h-6 rounded-full bg-accent transition-colors">
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{
                    transform: 'translateX(22px)',
                    left: '2px'
                  }} />

              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Meta Title Override
              </label>
              <input
                type="text"
                placeholder="Leave blank to use default template"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />

            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Meta Description Override
              </label>
              <textarea
                rows={2}
                placeholder="Leave blank to use default description"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none" />

            </div>
          </fieldset>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-slate-50/50">
          <button className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            Discard Changes
          </button>
          <button className="px-5 py-2 text-sm font-medium text-navy-950 bg-accent hover:bg-accent-hover rounded-lg transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>);

}