// ─── Auth Types ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  profilePicture: string;
  dob: string;
  status: "active" | "inactive";
  phoneNumber?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// ─── Log Types ────────────────────────────────────────────────────────────────

export type LogType =
  | "auth"
  | "user"
  | "team"
  | "blog"
  | "service"
  | "about"
  | "faq"
  | string;

export type LogAction =
  | "LOGIN"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_UPDATE"
  | "PASSWORD_RESET"
  | "PASSWORD_RESET_REQUEST"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "BULK_CREATE"
  | "CREATE_ITEM"
  | "UPDATE_ITEM"
  | "DELETE_ITEM"
  | string;

export interface Log {
  _id: string;
  createdBy:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        userName: string;
      };
  ip?: string;
  browserName?: string;
  userName?: string;
  type: LogType;
  action?: LogAction;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogState {
  logs: Log[];
  currentLog: Log | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  availableTypes: string[];
  availableActions: string[];
}

// ─── Users Management Types ───────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  _id?: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  profilePicture?: string;
  dob?: string;
  status: "active" | "inactive";
  phoneNumber?: string;
  address?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersState {
  users: AdminUser[];
  currentUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// ─── Blog Types ───────────────────────────────────────────────────────────────
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  imageAlt?: string;
  author?: string;
  authorTitle?: string;
  date: string;
  publishedAt?: string;
  status: "draft" | "published" | "scheduled";
  category?: string;
  tags: string[];
  excerpt?: string;
  readingTime?: number;
  views?: number;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}
export interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// ─── Service Types ────────────────────────────────────────────────────────────
export interface ServiceItem {
  _id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  image?: string;
  duration?: string;
  features: string[];
  benefits: string[];
  specialists?: string;
  order?: number;
}
export interface Service {
  _id: string;
  title: string;
  type: "clinic" | "institute" | "research";
  category: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image?: string;
  features: string[];
  benefits: string[];
  duration?: string;
  specialists?: string;
  items: ServiceItem[];
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
export interface ServiceState {
  services: Service[];
  currentService: Service | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// ─── Team Types ───────────────────────────────────────────────────────────────
export interface ScheduleSlot {
  day: string;
  hours: string;
}
export interface TeamMember {
  _id: string;
  name: string;
  title: string;
  slug: string;
  specialty: string;
  tagline?: string;
  image: string;
  bio: string;
  education: string[];
  specialties: string[];
  experience: string;
  languages: string[];
  awards?: string[];
  schedule: ScheduleSlot[] | Record<string, string>;
  contact: { phone?: string; email?: string; address?: string };
  social: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
  };
  isActive?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}
export interface TeamState {
  members: TeamMember[];
  currentMember: TeamMember | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// ─── About Types ──────────────────────────────────────────────────────────────
export interface AboutSection {
  title: string;
  content: string;
  icon?: string;
}
export interface OpenHour {
  day: string;
  hours: string;
  closed: boolean;
}
export interface About {
  _id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  phone?: string;
  openHours: OpenHour[];
  visible: boolean;
  sections: AboutSection[];
  createdAt: string;
  updatedAt: string;
}
export interface AboutState {
  about: About | null;
  isLoading: boolean;
  error: string | null;
}

// ─── FAQ Types ────────────────────────────────────────────────────────────────
export type FaqReasonType =
  | "General"
  | "Services"
  | "Treatment"
  | "Pricing"
  | "Insurance"
  | "Other";
export interface FaqReason {
  _id?: string;
  question: string;
  answer: string;
  type: FaqReasonType;
}
export interface Faq {
  _id: string;
  title: string;
  backgroundImage?: string;
  reasons: FaqReason[];
  createdAt: string;
  updatedAt: string;
}
export interface FaqState {
  content: Faq | null;
  isLoading: boolean;
  error: string | null;
}

// ─── Root State ───────────────────────────────────────────────────────────────
export interface RootState {
  auth: AuthState;
  blog: BlogState;
  services: ServiceState;
  team: TeamState;
  about: AboutState;
  faqs: FaqState;
  logs: LogState;
  users: UsersState;
}
