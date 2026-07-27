export interface Timestamped {
  id: string | number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  title?: string;
  description?: string;
  type: ToastType;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type?: string;
  created_at?: string;
  createdAt?: string;
  time?: string;
  description?: string;
  link?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar_url?: string;
  avatarUrl?: string;
}

export interface Session {
  user: AdminUser;
  access_token?: string;
  token?: string;
  expires_at?: number;
  expiresAt?: number;
}

export type ServiceStatus = 'active' | 'inactive' | 'published' | 'draft';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  sort_order?: number;
  order?: number;
  status: ServiceStatus;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceInput {
  title: string;
  description: string;
  icon: string;
  image: string | null;
  sort_order?: number;
  order?: number;
  status: ServiceStatus;
}

export type ProjectStatus = 'active' | 'inactive' | 'published' | 'draft';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  before_image?: string | null;
  beforeImage?: string | null;
  after_image?: string | null;
  afterImage?: string | null;
  category: string | null;
  completion_date?: string | null;
  location?: string | null;
  sort_order?: number;
  order?: number;
  status: ProjectStatus;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectInput {
  title: string;
  description: string | null;
  before_image?: string | null;
  beforeImage?: string | null;
  after_image?: string | null;
  afterImage?: string | null;
  category: string | null;
  completion_date?: string | null;
  location?: string | null;
  sort_order?: number;
  order?: number;
  status: ProjectStatus;
}

export interface PortfolioImage {
  id: string;
  title: string | null;
  image_url?: string;
  url?: string;
  category: string | null;
  sort_order?: number;
  order?: number;
  size?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface PortfolioImageInput {
  title: string | null;
  image_url?: string;
  url?: string;
  category: string | null;
  sort_order?: number;
  order?: number;
}

export type GalleryImage = PortfolioImage;
export type GalleryImageInput = PortfolioImageInput;

export interface Testimonial {
  id: string;
  client_name?: string;
  clientName?: string;
  photo: string | null;
  rating: number;
  review: string | null;
  company: string | null;
  published?: boolean;
  status?: string;
  sort_order?: number;
  order?: number;
  created_at?: string;
  createdAt?: string;
}

export interface TestimonialInput {
  client_name?: string;
  clientName?: string;
  photo: string | null;
  rating: number;
  review: string | null;
  company: string | null;
  published?: boolean;
  status?: string;
  sort_order?: number;
  order?: number;
}

export interface HeroContent {
  id?: number | string;
  headline: string;
  subtitle: string;
  cta_text?: string;
  ctaText?: string;
  cta_link?: string;
  ctaLink?: string;
  background_image?: string | null;
  backgroundImage?: string | null;
  updated_at?: string;
  updatedAt?: string;
}

export interface AboutContent {
  id?: number | string;
  title: string;
  description: string;
  experience?: string | null;
  experienceYears?: string | null;
  image: string | null;
  skills: (string | { id: string; name: string; level: number })[] | null;
  updated_at?: string;
  updatedAt?: string;
}

export interface SeoSettings {
  id?: number | string;
  meta_title?: string;
  metaTitle?: string;
  meta_description?: string;
  metaDescription?: string;
  keywords: string | null;
  og_image?: string | null;
  ogImage?: string | null;
  updated_at?: string;
  updatedAt?: string;
}

export type SeoContent = SeoSettings;

export interface SiteSettings {
  id?: number | string;
  business_name?: string;
  businessName?: string;
  owner_name?: string | null;
  ownerName?: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  siret: string | null;
  ape_code?: string | null;
  apeCode?: string | null;
  maps_embed?: string | null;
  mapsEmbed?: string | null;
  opening_hours?: any;
  openingHours?: any;
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_linkedin?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  updated_at?: string;
  updatedAt?: string;
}

export type SettingsContent = SiteSettings;

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  folder: string;
  size: number;
  mime_type?: string;
  type?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface MediaItemInput {
  name: string;
  url: string;
  folder: string;
  size: number;
  mime_type?: string;
  type?: string;
}

export type MediaFile = MediaItem;
export type MediaFileInput = MediaItemInput;

export type LeadStatus = 'new' | 'in_progress' | 'completed' | 'archived';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  project_type?: string | null;
  projectType?: string | null;
  message: string | null;
  source_page?: string | null;
  sourcePage?: string | null;
  location?: string | null;
  client_location?: string | null;
  status: LeadStatus;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface LeadUpdate {
  status?: LeadStatus;
}

export type ContactStatus = LeadStatus;
export interface ContactRequest extends Lead { }
export interface ContactRequestInput {
  name: string;
  phone: string;
  email?: string | null;
  project_type?: string | null;
  projectType?: string | null;
  message?: string | null;
  source_page?: string | null;
  status?: ContactStatus;
}

// ── NEW DYNAMIC PORTFOLIO SCHEMA TYPES ──────────────────────────────

export interface DynamicProject {
  id: string; // UUID
  num: string;
  icon: string | null;
  title: string;
  description: string;
  tags: string[];
  github: string | null;
  demo: string | null;
  created_at: string; // TIMESTAMPTZ
  updated_at: string;
}

export interface TimelineEntry {
  id: string; // UUID
  type: string;
  type_badge: string | null;
  role: string;
  date_range: string;
  org: string;
  description: string;
  tags: string[];
  created_at: string; // TIMESTAMPTZ
  updated_at: string;
}

export interface SkillCategory {
  id: string; // UUID
  name: string;
  icon: string | null;
  icon_class: string | null;
  order_index: number;
  created_at: string; // TIMESTAMPTZ
}

export interface Skill {
  id: string; // UUID
  category_id: string; // UUID
  name: string;
  level: number;
  icon: string | null;
  order_index: number;
  created_at: string; // TIMESTAMPTZ
}
