import {
  FileText,
  UserPlus,
  CalendarCheck,
  MessageSquareHeart,
  Phone,
  ClipboardList,
} from 'lucide-react';
import type { FormField, FieldType } from './formFieldTypes';
import { makeFieldId } from './formFieldTypes';

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  title: string;
  formDescription: string;
  fields: Array<Omit<FormField, 'id'>>;
}

const f = (
  type: FieldType,
  question: string,
  extra: Partial<Omit<FormField, 'id' | 'type' | 'question'>> = {}
): Omit<FormField, 'id'> => ({ type, question, required: false, ...extra });

export const formTemplates: FormTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Form',
    description: 'Start from scratch and build any form you need.',
    icon: FileText,
    title: 'Untitled Form',
    formDescription: '',
    fields: [f('short_text', 'Untitled Short Text')],
  },
  {
    id: 'registration',
    name: 'Registration',
    description: 'Sign people up for an account, program, or event.',
    icon: UserPlus,
    title: 'Program Registration',
    formDescription: 'Register to join one of our mental wellness programs.',
    fields: [
      f('short_text', 'Full Name', { required: true }),
      f('email', 'Email Address', { required: true }),
      f('phone', 'Phone Number'),
      f('dropdown', 'Program of Interest', {
        required: true,
        options: ['Individual Therapy', 'Group Therapy', 'Couples Counseling', 'Youth Program'],
      }),
      f('date', 'Preferred Start Date'),
      f('checkboxes', 'How did you hear about us?', {
        options: ['Referral', 'Social Media', 'Search Engine', 'Community Event'],
      }),
    ],
  },
  {
    id: 'consultation',
    name: 'Consultation Booking',
    description: 'Let clients request and schedule a consultation.',
    icon: CalendarCheck,
    title: 'Book a Consultation',
    formDescription: 'Request a confidential consultation with one of our specialists.',
    fields: [
      f('short_text', 'Full Name', { required: true }),
      f('email', 'Email Address', { required: true }),
      f('phone', 'Contact Number', { required: true }),
      f('multiple_choice', 'Consultation Type', {
        required: true,
        options: ['In-person', 'Telehealth (Video)', 'Phone Call'],
      }),
      f('date', 'Preferred Date', { required: true }),
      f('time', 'Preferred Time'),
      f('long_text', 'What would you like to discuss?', {
        helpText: 'This information is kept strictly confidential.',
      }),
    ],
  },
  {
    id: 'intake',
    name: 'Patient Intake',
    description: 'Collect detailed information before a first appointment.',
    icon: ClipboardList,
    title: 'New Patient Intake',
    formDescription: 'Please complete this form before your first appointment.',
    fields: [
      f('heading', 'Personal Information'),
      f('short_text', 'Full Legal Name', { required: true }),
      f('date', 'Date of Birth', { required: true }),
      f('email', 'Email Address', { required: true }),
      f('heading', 'Health Background'),
      f('long_text', 'Reason for Visit', { required: true }),
      f('yes_no', 'Have you received therapy before?'),
      f('rating', 'How would you rate your current stress level?'),
    ],
  },
  {
    id: 'feedback',
    name: 'Feedback Survey',
    description: 'Measure satisfaction and gather suggestions.',
    icon: MessageSquareHeart,
    title: 'Patient Feedback',
    formDescription: 'Your feedback helps us improve our care.',
    fields: [
      f('rating', 'Overall, how satisfied are you with our service?', { required: true }),
      f('multiple_choice', 'Would you recommend us to others?', { options: ['Definitely', 'Maybe', 'No'] }),
      f('long_text', 'What did we do well?'),
      f('long_text', 'How could we improve?'),
    ],
  },
  {
    id: 'contact',
    name: 'Contact Us',
    description: 'A simple way for visitors to reach your team.',
    icon: Phone,
    title: 'Get In Touch',
    formDescription: "We'd love to hear from you. We'll respond within 1 business day.",
    fields: [
      f('short_text', 'Name', { required: true }),
      f('email', 'Email', { required: true }),
      f('dropdown', 'Subject', { options: ['General Inquiry', 'Appointments', 'Billing', 'Other'] }),
      f('long_text', 'Message', { required: true }),
    ],
  },
];

export function instantiateTemplate(template: FormTemplate): FormField[] {
  return template.fields.map((field) => ({ ...field, id: makeFieldId() }));
}
