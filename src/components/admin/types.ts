/**
 * Admin Dashboard Types
 * Shared type definitions for admin components
 */

export interface AdminStats {
  pendingStories: number;
  approvedToday: number;
  totalCurators: number;
  weeklySubmissions: number;
  pendingEvents?: number;
  eventsApprovedToday?: number;
  totalEventOrganizers?: number;
  weeklyEventSubmissions?: number;
}

export interface ModerationItem {
  id: string;
  title: string;
  url: string;
  submittedBy: string;
  submittedAt: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  votes: number;
  excerpt: string;
}

export interface EventModerationItem {
  id: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  category: string;
  type: 'virtual' | 'in-person' | 'hybrid';
  date: string;
  description: string;
  organizer: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StoryFormData {
  title: string;
  url: string;
  category: string;
  excerpt: string;
  tags: string;
}

export interface EventFormData {
  title: string;
  description: string;
  excerpt: string;
  category: 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action' | '';
  type: 'virtual' | 'in-person' | 'hybrid' | '';
  date: string;
  endDate: string;
  locationDetails: string;
  organizerName: string;
  organizerEmail: string;
  organizerOrganization: string;
  registrationRequired: boolean;
  capacity: string;
  registrationUrl: string;
  accessibilityFeatures: string;
  tags: string;
}

export interface EventSubmission {
  title: string;
  description: string;
  excerpt: string;
  category: 'mutual-aid' | 'organizing' | 'education' | 'celebration' | 'support' | 'action';
  type: 'virtual' | 'in-person' | 'hybrid';
  date: string;
  endDate?: string;
  location: {
    type: 'virtual' | 'in-person' | 'hybrid';
    details?: string;
  };
  organizer: {
    name: string;
    email: string;
    organization?: string;
    communityMember: boolean;
  };
  registration: {
    required: boolean;
    capacity?: number;
    registrationUrl?: string;
  };
  accessibilityFeatures: string[];
  tags: string[];
}

export interface VoicesArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'opinion' | 'analysis' | 'editorial' | 'community' | 'liberation';
  tags?: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface VoicesArticleSubmission {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'opinion' | 'analysis' | 'editorial' | 'community' | 'liberation';
  tags: string[];
  featured: boolean;
  published: boolean;
}

export interface TabDefinition {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
