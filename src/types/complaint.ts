import { Image, Comment, CommunitySentiment } from './shared';

export interface ResolutionDetail {
  description: string;
  budget?: number;
  images?: Image[];
}

export type ComplaintCategory =
  | "noise"
  | "sanitation"
  | "public_safety"
  | "traffic"
  | "infrastructure"
  | "water_electricity"
  | "domestic"
  | "environment"
  | "others";

export type ComplaintStatus =
  | "submitted"
  | "under_review"
  | "scheduled"
  | "in_progress"
  | "resolved"
  | "dismissed";

export interface ComplaintAiAnalysis {
  // --- Existing Logic ---
  summary: string;

  // --- Solution & Action Plan ---
  suggestedSolution: string;        // Step-by-step fix for the problem
  requiredResources: string[];     // Tools or materials needed (e.g., "Cere-mix", "Backhoe")
  estimatedManpower: string;       // e.g., "2 maintenance staff", "Barangay Tanods"
  estimatedTimeframe: string;      // AI's guess on how long the fix takes

  // --- Barangay Context & Governance ---
  departmentRouting: string;       // Which committee handles this (e.g., "Health & Sanitation")
  budgetEstimate?: string;         // e.g., "₱1,000 - ₱5,000"

  // --- Risk & Prevention ---
  publicSafetyRisk: string;        // Immediate dangers (e.g., "Risk of electrocution")
  preventionAdvice: string;        // How the Barangay can prevent this from happening again
}

export interface ComplaintLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: "low" | "medium" | "high" | "urgent";
  complainantName: string;
  complainantId: string;
  location?: ComplaintLocation;
  images?: Image[];
  resolutionDetails?: ResolutionDetail;
  resolvedAt?: Date;
  scheduledAt?: Date;
  likes?: string[];
  dislikes?: string[];
  comments?: Comment[];
  aiAnalysis?: ComplaintAiAnalysis;
  communitySentiment?: CommunitySentiment;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplaintInput {
  title: string;
  description: string;
  category: ComplaintCategory;
  location?: ComplaintLocation;
  images?: Image[];
}

export interface UpdateComplaintInput {
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  status?: ComplaintStatus;
  location?: ComplaintLocation;
  images?: Image[];
  resolutionDetails?: ResolutionDetail;
  resolvedAt?: Date;
  scheduledAt?: Date;
}
