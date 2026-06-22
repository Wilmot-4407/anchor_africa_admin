import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Calendar,
  Clock,
  CircleDot,
  CheckSquare,
  ChevronDownSquare,
  ToggleLeft,
  Star,
  Upload,
  Heading,
  type LucideIcon,
} from 'lucide-react';

export type FieldType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'number'
  | 'date'
  | 'time'
  | 'multiple_choice'
  | 'checkboxes'
  | 'dropdown'
  | 'yes_no'
  | 'rating'
  | 'file'
  | 'heading';

export interface FieldTypeMeta {
  type: FieldType;
  label: string;
  icon: LucideIcon;
  hasOptions?: boolean;
  layoutOnly?: boolean;
}

export const fieldTypes: FieldTypeMeta[] = [
  { type: 'short_text', label: 'Short Text', icon: Type },
  { type: 'long_text', label: 'Paragraph', icon: AlignLeft },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'phone', label: 'Phone', icon: Phone },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'time', label: 'Time', icon: Clock },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: CircleDot, hasOptions: true },
  { type: 'checkboxes', label: 'Checkboxes', icon: CheckSquare, hasOptions: true },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDownSquare, hasOptions: true },
  { type: 'yes_no', label: 'Yes / No', icon: ToggleLeft },
  { type: 'rating', label: 'Rating', icon: Star },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'heading', label: 'Section Heading', icon: Heading, layoutOnly: true },
];

export const fieldTypeMap: Record<FieldType, FieldTypeMeta> = fieldTypes.reduce(
  (acc, ft) => {
    acc[ft.type] = ft;
    return acc;
  },
  {} as Record<FieldType, FieldTypeMeta>
);

export interface FormField {
  id: string;
  type: FieldType;
  question: string;
  helpText?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  colSpan?: 1 | 2;
}

export function makeFieldId() {
  return Math.random().toString(36).slice(2, 9);
}

export function createField(type: FieldType): FormField {
  const meta = fieldTypeMap[type];
  return {
    id: makeFieldId(),
    type,
    question: meta.layoutOnly ? 'Section Heading' : `Untitled ${meta.label}`,
    required: false,
    options: meta.hasOptions ? ['Option 1', 'Option 2'] : undefined,
  };
}
