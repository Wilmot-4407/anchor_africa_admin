// Auth Types
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

// Blog Types
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author?: string;
  date: string;
  tags: string[];
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

// Service Types
export interface Service {
  _id: string;
  title: string;
  type: "clinic" | "institute";
  category: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  features: string[];
  duration: string;
  specialists: string;
  benefits: string[];
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

// Team Types
export interface TeamMember {
  _id: string;
  name: string;
  title: string;
  slug: string;
  specialty: string;
  image: string;
  bio: string;
  education: string[];
  specialties: string[];
  experience: string;
  languages: string[];
  schedule: Record<string, string>;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  social: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
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

// About Types
export interface AboutSection {
  title: string;
  content: string;
  icon?: string;
}

export interface About {
  _id: string;
  title: string;
  description: string;
  image?: string;
  sections: AboutSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AboutState {
  about: About | null;
  isLoading: boolean;
  error: string | null;
}

// WhyChooseUs Types
export interface WhyChooseUsReason {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseUs {
  _id: string;
  title: string;
  backgroundImage?: string;
  reasons: WhyChooseUsReason[];
  createdAt: string;
  updatedAt: string;
}

export interface WhyChooseUsState {
  content: WhyChooseUs | null;
  isLoading: boolean;
  error: string | null;
}

// Root State
export interface RootState {
  auth: AuthState;
  blog: BlogState;
  services: ServiceState;
  team: TeamState;
  about: AboutState;
  whyChooseUs: WhyChooseUsState;
}
