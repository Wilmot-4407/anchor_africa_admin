export interface SectionItem {
  id: string;
  title: string;
  description: string;
  status: 'Published' | 'Draft';
  updatedAt: string;
}

export interface WebsiteSection {
  id: string;
  label: string;
  itemNoun: string;
  hint?: string;
}

export interface SectionGroup {
  id: string;
  label: string;
  sections: WebsiteSection[];
}

export const sectionGroups: SectionGroup[] = [
  {
    id: 'pages',
    label: 'Core Pages',
    sections: [
      { id: 'home', label: 'Home', itemNoun: 'Block', hint: 'Top-level landing page blocks' },
      { id: 'about', label: 'About Us', itemNoun: 'Block' },
      { id: 'contact', label: 'Contact', itemNoun: 'Detail' },
      { id: 'careers', label: 'Careers', itemNoun: 'Opening' },
      { id: 'privacy', label: 'Privacy Policy', itemNoun: 'Clause' },
      { id: 'terms', label: 'Terms of Service', itemNoun: 'Clause' },
    ],
  },
  {
    id: 'homepage',
    label: 'Homepage Blocks',
    sections: [
      { id: 'hero', label: 'Hero Section', itemNoun: 'Slide' },
      { id: 'highlights', label: 'Highlights', itemNoun: 'Highlight' },
      { id: 'stats', label: 'Impact Stats', itemNoun: 'Stat' },
      { id: 'cta', label: 'Call To Action', itemNoun: 'Banner' },
    ],
  },
  {
    id: 'services',
    label: 'Services & Programs',
    sections: [
      { id: 'services', label: 'Services', itemNoun: 'Service' },
      { id: 'programs', label: 'Programs', itemNoun: 'Program' },
      { id: 'pricing', label: 'Pricing Plans', itemNoun: 'Plan' },
      { id: 'specialties', label: 'Specialties', itemNoun: 'Specialty' },
    ],
  },
  {
    id: 'people',
    label: 'People',
    sections: [
      { id: 'team', label: 'Team Members', itemNoun: 'Member' },
      { id: 'leadership', label: 'Leadership', itemNoun: 'Leader' },
      { id: 'partners', label: 'Partners', itemNoun: 'Partner' },
      { id: 'volunteers', label: 'Volunteers', itemNoun: 'Volunteer' },
    ],
  },
  {
    id: 'content',
    label: 'Content & Media',
    sections: [
      { id: 'blog', label: 'Blog Posts', itemNoun: 'Post' },
      { id: 'news', label: 'News', itemNoun: 'Article' },
      { id: 'events', label: 'Events', itemNoun: 'Event' },
      { id: 'press', label: 'Press Releases', itemNoun: 'Release' },
      { id: 'resources', label: 'Resources', itemNoun: 'Resource' },
      { id: 'gallery', label: 'Gallery', itemNoun: 'Image' },
      { id: 'videos', label: 'Videos', itemNoun: 'Video' },
    ],
  },
  {
    id: 'engagement',
    label: 'Engagement',
    sections: [
      { id: 'testimonials', label: 'Testimonials', itemNoun: 'Testimonial' },
      { id: 'faq', label: 'FAQ', itemNoun: 'Question' },
      { id: 'newsletter', label: 'Newsletter', itemNoun: 'Campaign' },
      { id: 'donations', label: 'Donations', itemNoun: 'Tier' },
    ],
  },
  {
    id: 'locations',
    label: 'Locations',
    sections: [
      { id: 'clinics', label: 'Clinics', itemNoun: 'Clinic' },
      { id: 'hours', label: 'Office Hours', itemNoun: 'Schedule' },
    ],
  },
  {
    id: 'settings',
    label: 'Site Settings',
    sections: [
      { id: 'nav', label: 'Navigation Menu', itemNoun: 'Link' },
      { id: 'footer', label: 'Footer Links', itemNoun: 'Link' },
      { id: 'social', label: 'Social Links', itemNoun: 'Link' },
      { id: 'seo', label: 'SEO & Metadata', itemNoun: 'Entry' },
    ],
  },
];

export const allSections: WebsiteSection[] = sectionGroups.flatMap((g) => g.sections);

const curatedSeeds: Record<string, Omit<SectionItem, 'id' | 'updatedAt'>[]> = {
  services: [
    { title: 'Individual Therapy', description: 'One-on-one sessions tailored to your needs.', status: 'Published' },
    { title: 'Couples Counseling', description: 'Navigate relationship challenges together.', status: 'Published' },
    { title: 'Group Therapy', description: 'Find support in a shared environment.', status: 'Draft' },
    { title: 'Psychiatric Evaluation', description: 'Comprehensive mental health assessments.', status: 'Published' },
  ],
  faq: [
    { title: 'Do you accept insurance?', description: 'We accept most major insurance providers.', status: 'Published' },
    { title: 'How long are sessions?', description: 'Standard sessions run for 50 minutes.', status: 'Published' },
    { title: 'Is telehealth available?', description: 'Yes, secure video sessions are offered.', status: 'Published' },
  ],
  team: [
    { title: 'Dr. Sarah Jenkins', description: 'Clinical Director, Licensed Psychologist.', status: 'Published' },
    { title: 'Dr. Michael Chen', description: 'Psychiatrist, Mood Disorders.', status: 'Published' },
    { title: 'Dr. Emily Wright', description: 'Child & Adolescent Therapist.', status: 'Draft' },
  ],
  hero: [
    { title: 'Healing starts here', description: 'Compassionate mental health care for everyone.', status: 'Published' },
    { title: 'You are not alone', description: 'Connect with caring professionals today.', status: 'Draft' },
  ],
};

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export function seedItems(section: WebsiteSection): SectionItem[] {
  const curated = curatedSeeds[section.id];
  if (curated) {
    return curated.map((c) => ({ ...c, id: makeId(), updatedAt: '2 days ago' }));
  }
  return Array.from({ length: 3 }).map((_, i) => ({
    id: makeId(),
    title: `${section.itemNoun} ${i + 1}`,
    description: `Sample ${section.itemNoun.toLowerCase()} content for the ${section.label} section.`,
    status: i % 3 === 2 ? 'Draft' : 'Published',
    updatedAt: `${i + 1} day${i === 0 ? '' : 's'} ago`,
  }));
}

export function buildInitialContent(): Record<string, SectionItem[]> {
  const content: Record<string, SectionItem[]> = {};
  for (const section of allSections) {
    content[section.id] = seedItems(section);
  }
  return content;
}
