export type ComplaintCategory =
  | 'noise'
  | 'sanitation'
  | 'public_safety'
  | 'traffic'
  | 'infrastructure'
  | 'water_electricity'
  | 'domestic'
  | 'environment'
  | 'others';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'scheduled'
  | 'in_progress'
  | 'resolved'
  | 'dismissed';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  complainantName: string;
  complainantId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  images?: { uri: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  category: ComplaintCategory;
  location: {
    latitude: number;
    longitude: number;
  };
  images?: { uri: string }[];
}

export interface UpdateComplaintInput {
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  location?: {
    latitude: number;
    longitude: number;
  };
  images?: { uri: string }[];
}

export type ProjectCategory =
  | 'infrastructure'
  | 'health'
  | 'education'
  | 'environment'
  | 'livelihood'
  | 'disaster_preparedness'
  | 'social_services'
  | 'sports_culture'
  | 'others';

export type ProjectStatus =
  | 'planned'
  | 'approved'
  | 'ongoing'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

export interface ProjectLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  location?: ProjectLocation;
  images?: { uri: string }[];
  createdAt: Date;
  updatedAt: Date;
}
