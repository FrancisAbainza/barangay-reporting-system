import { Image, Comment, CommunitySentiment } from './shared';

export type ProjectCategory =
  | "infrastructure"
  | "health"
  | "education"
  | "environment"
  | "livelihood"
  | "disaster_preparedness"
  | "social_services"
  | "sports_culture"
  | "others";

export type ProjectStatus =
  | "planned"
  | "approved"
  | "ongoing"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface ProjectLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface ProgressUpdate {
  description: string;
  image?: { uri: string };
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: Image[];
  progressPercentage: number;
  progressUpdates?: ProgressUpdate[];
  likes?: string[];
  dislikes?: string[];
  comments?: Comment[];
  communitySentiment?: CommunitySentiment;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: Image[];
  progressPercentage: number;
  progressUpdates?: ProgressUpdate[];
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  startDate?: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  budget?: number;
  contractor?: string;
  sourceOfFunds?: string;
  location?: ProjectLocation;
  images?: Image[];
  progressPercentage?: number;
  progressUpdates?: ProgressUpdate[];
}
