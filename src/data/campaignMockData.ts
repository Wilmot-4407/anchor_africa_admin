import type { FormField } from './formFieldTypes';
import { makeFieldId } from './formFieldTypes';

export type FormCategory = 'Intake' | 'Survey' | 'Registration' | 'Contact' | 'Feedback' | 'Custom';
export type FormStatus = 'active' | 'draft' | 'archived';
export type SubmissionStatus = 'new' | 'reviewed' | 'followed_up';

export interface CampaignForm {
  id: string;
  name: string;
  category: FormCategory;
  status: FormStatus;
  responses: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  fields: FormField[];
  shareUrl: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  respondent: string;
  email: string;
  submittedAt: string;
  data: Record<string, string | string[]>;
  status: SubmissionStatus;
}

export interface DailyMetric {
  date: string;
  views: number;
  responses: number;
}

const mk = () => makeFieldId();

export const mockForms: CampaignForm[] = [
  {
    id: 'form-001',
    name: 'New Patient Intake',
    category: 'Intake',
    status: 'active',
    responses: 124,
    views: 567,
    createdAt: '2026-01-15',
    updatedAt: '2026-06-10',
    description: 'Collect detailed patient information before their first appointment.',
    shareUrl: 'https://forms.anchorafrica.org/f/new-patient-intake',
    fields: [
      { id: mk(), type: 'heading', question: 'Personal Information', required: false },
      { id: mk(), type: 'short_text', question: 'Full Legal Name', required: true },
      { id: mk(), type: 'date', question: 'Date of Birth', required: true },
      { id: mk(), type: 'email', question: 'Email Address', required: true },
      { id: mk(), type: 'phone', question: 'Phone Number', required: false },
      { id: mk(), type: 'heading', question: 'Health Background', required: false },
      { id: mk(), type: 'long_text', question: 'Reason for Visit', required: true, helpText: 'This information is kept strictly confidential.' },
      { id: mk(), type: 'yes_no', question: 'Have you received therapy before?', required: false },
      { id: mk(), type: 'rating', question: 'Rate your current stress level (1 = low, 5 = high)', required: false },
    ],
  },
  {
    id: 'form-002',
    name: 'Patient Feedback Survey',
    category: 'Feedback',
    status: 'active',
    responses: 87,
    views: 342,
    createdAt: '2026-02-20',
    updatedAt: '2026-06-08',
    description: 'Measure patient satisfaction and gather improvement suggestions.',
    shareUrl: 'https://forms.anchorafrica.org/f/patient-feedback',
    fields: [
      { id: mk(), type: 'rating', question: 'Overall satisfaction with our service', required: true },
      { id: mk(), type: 'multiple_choice', question: 'Would you recommend us to others?', required: true, options: ['Definitely yes', 'Possibly', 'No'] },
      { id: mk(), type: 'long_text', question: 'What did we do well?', required: false },
      { id: mk(), type: 'long_text', question: 'How could we improve?', required: false },
    ],
  },
  {
    id: 'form-003',
    name: 'Program Registration',
    category: 'Registration',
    status: 'active',
    responses: 56,
    views: 198,
    createdAt: '2026-03-05',
    updatedAt: '2026-05-30',
    description: 'Sign people up for our mental wellness programs.',
    shareUrl: 'https://forms.anchorafrica.org/f/program-registration',
    fields: [
      { id: mk(), type: 'short_text', question: 'Full Name', required: true },
      { id: mk(), type: 'email', question: 'Email Address', required: true },
      { id: mk(), type: 'phone', question: 'Phone Number', required: false },
      { id: mk(), type: 'dropdown', question: 'Program of Interest', required: true, options: ['Individual Therapy', 'Group Therapy', 'Couples Counseling', 'Youth Program'] },
      { id: mk(), type: 'date', question: 'Preferred Start Date', required: false },
      { id: mk(), type: 'checkboxes', question: 'How did you hear about us?', required: false, options: ['Referral', 'Social Media', 'Search Engine', 'Community Event'] },
    ],
  },
  {
    id: 'form-004',
    name: 'Consultation Booking',
    category: 'Contact',
    status: 'active',
    responses: 43,
    views: 271,
    createdAt: '2026-03-18',
    updatedAt: '2026-06-15',
    description: 'Let clients request and schedule a consultation with our specialists.',
    shareUrl: 'https://forms.anchorafrica.org/f/book-consultation',
    fields: [
      { id: mk(), type: 'short_text', question: 'Full Name', required: true },
      { id: mk(), type: 'email', question: 'Email Address', required: true },
      { id: mk(), type: 'phone', question: 'Contact Number', required: true },
      { id: mk(), type: 'multiple_choice', question: 'Consultation Type', required: true, options: ['In-person', 'Telehealth (Video)', 'Phone Call'] },
      { id: mk(), type: 'date', question: 'Preferred Date', required: true },
      { id: mk(), type: 'time', question: 'Preferred Time', required: false },
      { id: mk(), type: 'long_text', question: 'What would you like to discuss?', required: false, helpText: 'This information is kept strictly confidential.' },
    ],
  },
  {
    id: 'form-005',
    name: 'Contact Us',
    category: 'Contact',
    status: 'draft',
    responses: 0,
    views: 12,
    createdAt: '2026-06-01',
    updatedAt: '2026-06-19',
    description: 'Simple contact form for website visitors and general inquiries.',
    shareUrl: 'https://forms.anchorafrica.org/f/contact-us',
    fields: [
      { id: mk(), type: 'short_text', question: 'Name', required: true },
      { id: mk(), type: 'email', question: 'Email', required: true },
      { id: mk(), type: 'dropdown', question: 'Subject', required: false, options: ['General Inquiry', 'Appointments', 'Billing', 'Other'] },
      { id: mk(), type: 'long_text', question: 'Message', required: true },
    ],
  },
  {
    id: 'form-006',
    name: 'Annual Wellness Survey 2025',
    category: 'Survey',
    status: 'archived',
    responses: 312,
    views: 891,
    createdAt: '2025-01-10',
    updatedAt: '2025-12-31',
    description: 'Annual patient wellness assessment survey for 2025.',
    shareUrl: 'https://forms.anchorafrica.org/f/wellness-2025',
    fields: [
      { id: mk(), type: 'rating', question: 'Rate your overall mental health this year', required: true },
      { id: mk(), type: 'checkboxes', question: 'Which services have you used this year?', required: false, options: ['Individual Therapy', 'Group Therapy', 'Online Resources', 'Crisis Support'] },
      { id: mk(), type: 'long_text', question: 'Additional feedback for our team', required: false },
    ],
  },
  {
    id: 'form-007',
    name: 'Community Outreach Interest',
    category: 'Survey',
    status: 'draft',
    responses: 0,
    views: 3,
    createdAt: '2026-06-19',
    updatedAt: '2026-06-19',
    description: 'Gauge community interest in upcoming outreach programs.',
    shareUrl: 'https://forms.anchorafrica.org/f/community-outreach',
    fields: [
      { id: mk(), type: 'short_text', question: 'Full Name', required: true },
      { id: mk(), type: 'email', question: 'Email Address', required: true },
      { id: mk(), type: 'checkboxes', question: 'Areas of interest', required: false, options: ['Youth Programs', 'Senior Support', 'Crisis Intervention', 'Community Workshops'] },
      { id: mk(), type: 'long_text', question: 'Tell us about yourself', required: false },
    ],
  },
];

const NAMES = [
  'Adaeze Okonkwo', 'Emeka Nwachukwu', 'Ngozi Adeleke', 'Chidi Obi',
  'Fatima Hassan', 'Yusuf Bello', 'Amaka Eze', 'Tunde Bakare',
  'Kemi Afolabi', 'Olu Adeola', 'Ifeoma Igwe', 'Seun Lawal',
];
const STATUSES: SubmissionStatus[] = ['new', 'reviewed', 'followed_up'];
const REASONS = [
  'Anxiety management and stress relief',
  'Depression support and ongoing therapy',
  'Family counseling and communication',
  'Trauma processing and recovery',
  'Work-life balance coaching',
];

function mkEmail(name: string) {
  return name.toLowerCase().replace(/\s+/g, '.') + '@example.com';
}

export const mockSubmissions: FormSubmission[] = [
  ...NAMES.map((name, i) => ({
    id: `sub-f1-${i}`,
    formId: 'form-001',
    respondent: name,
    email: mkEmail(name),
    submittedAt: new Date(2026, 5, 18 - Math.floor(i / 2), 9 + (i % 8), (i * 7) % 60).toISOString(),
    status: STATUSES[i % 3],
    data: {
      'Full Legal Name': name,
      'Email Address': mkEmail(name),
      'Phone Number': `+234 80${i}${String(i * 1234 + 1000000).slice(0, 7)}`,
      'Reason for Visit': REASONS[i % 5],
      'Have you received therapy before?': i % 2 === 0 ? 'Yes' : 'No',
      'Rate your current stress level (1 = low, 5 = high)': String((i % 5) + 1),
    },
  })),
  ...NAMES.slice(0, 8).map((name, i) => ({
    id: `sub-f2-${i}`,
    formId: 'form-002',
    respondent: name,
    email: mkEmail(name),
    submittedAt: new Date(2026, 5, 15 - Math.floor(i / 2), 10 + (i % 6), i * 8).toISOString(),
    status: STATUSES[(i + 1) % 3],
    data: {
      'Overall satisfaction with our service': String((i % 4) + 2),
      'Would you recommend us to others?': (['Definitely yes', 'Possibly', 'Definitely yes', 'Definitely yes'] as string[])[i % 4] || 'Possibly',
      'What did we do well?': 'The therapists are very professional and compassionate.',
      'How could we improve?': i % 2 === 0 ? 'Longer appointment slots would be helpful.' : 'More flexible scheduling options.',
    },
  })),
  ...NAMES.slice(0, 5).map((name, i) => ({
    id: `sub-f3-${i}`,
    formId: 'form-003',
    respondent: name,
    email: mkEmail(name),
    submittedAt: new Date(2026, 5, 12 - i, 11, i * 9).toISOString(),
    status: STATUSES[i % 3],
    data: {
      'Full Name': name,
      'Email Address': mkEmail(name),
      'Program of Interest': (['Individual Therapy', 'Group Therapy', 'Couples Counseling', 'Youth Program'] as string[])[i % 4],
      'How did you hear about us?': ['Referral', 'Social Media'][i % 2],
    },
  })),
];

export function getFormSubmissions(formId: string): FormSubmission[] {
  return mockSubmissions.filter(s => s.formId === formId);
}

export function generateDailyMetrics(views: number, responses: number): DailyMetric[] {
  const days = 14;
  const avgViews = views / days;
  const convRate = views > 0 ? responses / views : 0;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(2026, 5, 5 + i);
    const v = Math.max(1, Math.round(avgViews * (0.7 + Math.sin(i * 0.8) * 0.3 + (i % 3 === 0 ? 0.4 : 0))));
    return {
      date: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
      views: v,
      responses: Math.min(v, Math.round(v * convRate * (0.8 + (i % 4 === 0 ? 0.4 : 0)))),
    };
  });
}
