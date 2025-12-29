import { createContext, useContext, useState, ReactNode } from "react";
import type {
  ResolutionDetail,
  ComplaintCategory,
  ComplaintStatus,
  ComplaintAiAnalysis,
  Complaint,
  CreateComplaintInput,
  UpdateComplaintInput,
} from "../types/complaint";

import type { Image, Reply, Comment, CommunitySentiment } from "../types/shared";

// Re-export types for backward compatibility
export type {
  Image,
  ResolutionDetail,
  ComplaintCategory,
  ComplaintStatus,
  Reply,
  Comment,
  ComplaintAiAnalysis,
  CommunitySentiment,
  Complaint,
  CreateComplaintInput,
  UpdateComplaintInput,
};

// Context types
interface ComplaintDbContextType {
  complaints: Complaint[];
  createComplaint: (input: CreateComplaintInput) => Complaint;
  getComplaint: (id: string) => Complaint | undefined;
  deleteComplaint: (id: string) => boolean;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    scheduledAt?: Date,
    resolutionDetails?: ResolutionDetail
  ) => Complaint | null;
  addComplaintComment: (
    complaintId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ) => Comment | null;
  addReply: (
    complaintId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ) => Reply | null;
  generateAIAnalysis: (complaintId: string) => Promise<ComplaintAiAnalysis>;
  generateCommunitySentiment: (complaintId: string) => Promise<void>;
}

// Initial dummy data
const initialComplaints: Complaint[] = [
  {
    id: "c1",
    title: "Broken Street Light on Main Road",
    description:
      "The street light near the corner of Main Road has been broken for two weeks. It's causing safety concerns for pedestrians at night.",
    category: "infrastructure",
    status: "under_review",
    priority: "high",
    complainantName: "Juan Dela Cruz",
    complainantId: "user1",
    location: {
      latitude: 14.325412,
      longitude: 121.102834,
      address: "Corner Main Road, Barangay San Isidro",
    },
    images: [
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
    ],
    likes: ["user2", "user3"],
    dislikes: [],
    comments: [
      {
        id: "comment1",
        userId: "user2",
        userName: "Maria Santos",
        content: "I noticed this too! It's really dark at night.",
        likes: ["user1"],
        dislikes: [],
        replies: [
          {
            id: "reply1",
            userId: "admin1",
            userName: "Admin Staff",
            content: "Thank you for your feedback. We've scheduled an inspection for this week.",
            isAdmin: true,
            likes: ["user1", "user2"],
            dislikes: [],
            createdAt: new Date("2025-12-20T14:15:00"),
            updatedAt: new Date("2025-12-20T14:15:00"),
          },
        ],
        createdAt: new Date("2025-12-20T10:30:00"),
        updatedAt: new Date("2025-12-20T10:30:00"),
      },
    ],
    createdAt: new Date("2025-07-05T14:20:00"),
    updatedAt: new Date("2025-07-06T09:15:00"),
  },
  {
    id: "c2",
    title: "Noise Complaint from Construction Site",
    description:
      "Construction work starting at 6 AM is causing excessive noise disturbance in the residential area.",
    category: "noise",
    status: "scheduled",
    priority: "medium",
    complainantName: "Maria Santos",
    complainantId: "user2",
    location: {
      latitude: 14.321876,
      longitude: 121.108492,
      address: "Residential Area",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    likes: ["user1", "user4", "user5"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-07-22T07:15:00"),
    updatedAt: new Date("2025-07-23T11:00:00"),
  },
  {
    id: "c3",
    title: "Overflowing Garbage Bins",
    description:
      "The garbage bins at the corner of Rizal Street have been overflowing for three days. This is attracting pests and creating unsanitary conditions.",
    category: "sanitation",
    status: "in_progress",
    priority: "urgent",
    complainantName: "Pedro Reyes",
    complainantId: "user3",
    location: {
      latitude: 14.317943,
      longitude: 121.099875,
      address: "Corner Rizal Street",
    },
    images: [
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
    ],
    likes: ["user1", "user2", "user4"],
    dislikes: ["user6"],
    comments: [],
    createdAt: new Date("2025-08-08T09:30:00"),
    updatedAt: new Date("2025-08-13T14:10:00"),
  },
  {
    id: "c4",
    title: "Water Leak on Bonifacio Avenue",
    description:
      "There's a significant water leak from the main pipe on Bonifacio Avenue. Water is flooding the street.",
    category: "water_electricity",
    status: "resolved",
    priority: "urgent",
    complainantName: "Rosa Martinez",
    complainantId: "user4",
    location: {
      latitude: 14.328104,
      longitude: 121.110221,
      address: "Bonifacio Avenue",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    resolutionDetails: {
      description:
        "Replaced the damaged section of the main water pipe. Repairs completed successfully.",
      budget: 15000,
      images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    },
    resolvedAt: new Date("2025-08-21T16:30:00"),
    likes: ["user1", "user2"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-08-19T11:20:00"),
    updatedAt: new Date("2025-08-21T16:30:00"),
  },
  {
    id: "c5",
    title: "Dangerous Pothole on Highway",
    description:
      "Large pothole on the highway entrance is causing accidents and vehicle damage.",
    category: "public_safety",
    status: "submitted",
    priority: "high",
    complainantName: "Luis Fernandez",
    complainantId: "user5",
    location: {
      latitude: 14.313904,
      longitude: 121.105673,
      address: "Highway Entrance",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    likes: ["user1", "user3", "user6"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-08-30T13:45:00"),
    updatedAt: new Date("2025-08-30T13:45:00"),
  },
  {
    id: "c6",
    title: "Illegal Karaoke Past Midnight",
    description: "Loud karaoke sessions continue past midnight affecting nearby households.",
    category: "noise",
    status: "submitted",
    priority: "medium",
    complainantName: "Alvin Perez",
    complainantId: "user6",
    location: {
      latitude: 14.318742,
      longitude: 121.100934,
      address: "Phase 2 Residential Area",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    aiAnalysis: {
      summary: "Noise disturbance during prohibited hours.",
      suggestedSolution: "Issue warning and enforce barangay noise ordinance.",
      requiredResources: ["Barangay Tanods"],
      estimatedManpower: "2 barangay tanods",
      estimatedTimeframe: "1 night",
      departmentRouting: "Peace & Order",
      publicSafetyRisk: "Sleep disruption and stress",
      preventionAdvice: "Remind residents of curfew rules regularly",
    },
    createdAt: new Date("2025-09-10T20:10:00"),
    updatedAt: new Date("2025-09-10T20:10:00"),
  },
  {
    id: "c7",
    title: "Clogged Drain Causing Flooding",
    description: "Drain is clogged causing knee-high flooding after rain.",
    category: "infrastructure",
    status: "under_review",
    priority: "urgent",
    complainantName: "Jenny Cruz",
    complainantId: "user7",
    location: {
      latitude: 14.327102,
      longitude: 121.109832,
      address: "Block 3 Near Covered Court",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    aiAnalysis: {
      summary: "Blocked drainage system leading to flooding.",
      suggestedSolution: "Clear debris and inspect drainage line.",
      requiredResources: ["Shovel", "Drain cleaner truck"],
      estimatedManpower: "3 maintenance staff",
      estimatedTimeframe: "1 day",
      departmentRouting: "Infrastructure",
      budgetEstimate: "₱3,000 - ₱6,000",
      publicSafetyRisk: "Risk of accidents and waterborne disease",
      preventionAdvice: "Regular drainage maintenance",
    },
    createdAt: new Date("2025-09-20T09:40:00"),
    updatedAt: new Date("2025-09-20T09:40:00"),
  },
  {
    id: "c8",
    title: "Stray Dogs Roaming at Night",
    description: "Multiple stray dogs are roaming and acting aggressively.",
    category: "public_safety",
    status: "scheduled",
    priority: "high",
    complainantName: "Mark Villanueva",
    complainantId: "user8",
    location: {
      latitude: 14.314982,
      longitude: 121.104221,
      address: "Near Barangay Hall",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    aiAnalysis: {
      summary: "Stray animals pose risk to residents.",
      suggestedSolution: "Coordinate animal control for capture.",
      requiredResources: ["Animal control cage"],
      estimatedManpower: "2 animal control staff",
      estimatedTimeframe: "1 day",
      departmentRouting: "Public Safety",
      publicSafetyRisk: "Risk of bites and rabies",
      preventionAdvice: "Promote responsible pet ownership",
    },
    scheduledAt: new Date("2025-10-03T08:00:00"),
    createdAt: new Date("2025-10-01T18:00:00"),
    updatedAt: new Date("2025-10-01T18:00:00"),
  },
  {
    id: "c9",
    title: "Uncollected Garbage for 5 Days",
    description: "Garbage has not been collected causing foul odor.",
    category: "sanitation",
    status: "in_progress",
    priority: "high",
    complainantName: "Liza Moreno",
    complainantId: "user9",
    location: {
      latitude: 14.320556,
      longitude: 121.097842,
      address: "Purok 5",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    aiAnalysis: {
      summary: "Missed garbage collection schedule.",
      suggestedSolution: "Dispatch garbage truck immediately.",
      requiredResources: ["Garbage truck"],
      estimatedManpower: "4 sanitation staff",
      estimatedTimeframe: "Half day",
      departmentRouting: "Health & Sanitation",
      publicSafetyRisk: "Attracts pests and disease",
      preventionAdvice: "Ensure backup collection schedule",
    },
    createdAt: new Date("2025-10-12T07:30:00"),
    updatedAt: new Date("2025-10-13T10:00:00"),
  },
  {
    id: "c10",
    title: "Broken Sidewalk Tiles",
    description: "Sidewalk tiles are broken causing tripping hazards.",
    category: "infrastructure",
    status: "submitted",
    priority: "medium",
    complainantName: "Noel Garcia",
    complainantId: "user10",
    location: {
      latitude: 14.322993,
      longitude: 121.111012,
      address: "Main Access Road",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-10-24T11:10:00"),
    updatedAt: new Date("2025-10-24T11:10:00"),
  },
  {
    id: "c11",
    title: "Illegal Parking Blocking Road",
    description: "Vehicles parked illegally blocking emergency access.",
    category: "traffic",
    status: "under_review",
    priority: "high",
    complainantName: "Paolo Reyes",
    complainantId: "user11",
    location: {
      latitude: 14.316721,
      longitude: 121.106998,
      address: "Road 2 Extension",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-11-02T16:45:00"),
    updatedAt: new Date("2025-11-02T16:45:00"),
  },
  {
    id: "c12",
    title: "Open Electrical Wiring",
    description: "Exposed electrical wiring near a sidewalk.",
    category: "water_electricity",
    status: "scheduled",
    priority: "urgent",
    complainantName: "Carmen Flores",
    complainantId: "user12",
    location: {
      latitude: 14.328221,
      longitude: 121.107553,
      address: "Near Daycare Center",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    scheduledAt: new Date("2025-11-17T09:00:00"),
    createdAt: new Date("2025-11-14T08:20:00"),
    updatedAt: new Date("2025-11-14T08:20:00"),
  },
  {
    id: "c13",
    title: "Burning of Trash",
    description: "Residents are burning trash causing smoke.",
    category: "environment",
    status: "submitted",
    priority: "medium",
    complainantName: "Ramon Uy",
    complainantId: "user13",
    location: {
      latitude: 14.312984,
      longitude: 121.098774,
      address: "Back of Basketball Court",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-11-23T17:30:00"),
    updatedAt: new Date("2025-11-23T17:30:00"),
  },
  {
    id: "c14",
    title: "Domestic Dispute Disturbance",
    description: "Frequent shouting and disturbance reported.",
    category: "domestic",
    status: "under_review",
    priority: "high",
    complainantName: "Anonymous",
    complainantId: "user14",
    location: {
      latitude: 14.319331,
      longitude: 121.103214,
      address: "Interior Street 4",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-12-01T22:15:00"),
    updatedAt: new Date("2025-12-01T22:15:00"),
  },
  {
    id: "c15",
    title: "Fallen Tree Branch",
    description: "Tree branch fell and is blocking the sidewalk.",
    category: "environment",
    status: "resolved",
    priority: "medium",
    complainantName: "Henry Lim",
    complainantId: "user15",
    location: {
      latitude: 14.326784,
      longitude: 121.101998,
      address: "Parkside Road",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    resolutionDetails: {
      description: "Cleared fallen branch and cleaned area.",
    },
    resolvedAt: new Date("2025-12-07T15:00:00"),
    createdAt: new Date("2025-12-07T10:00:00"),
    updatedAt: new Date("2025-12-07T15:00:00"),
  },
  {
    id: "c16",
    title: "Loose Manhole Cover",
    description: "Manhole cover moves when stepped on.",
    category: "public_safety",
    status: "in_progress",
    priority: "urgent",
    complainantName: "Eric Santos",
    complainantId: "user16",
    location: {
      latitude: 14.324211,
      longitude: 121.110123,
      address: "Near Public Market",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-12-13T06:40:00"),
    updatedAt: new Date("2025-12-13T12:00:00"),
  },
  {
    id: "c17",
    title: "Water Interruption",
    description: "No water supply since yesterday afternoon.",
    category: "water_electricity",
    status: "under_review",
    priority: "high",
    complainantName: "Grace Ong",
    complainantId: "user17",
    location: {
      latitude: 14.315998,
      longitude: 121.107221,
      address: "Phase 1 Housing",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-12-17T05:30:00"),
    updatedAt: new Date("2025-12-17T05:30:00"),
  },
  {
    id: "c18",
    title: "Street Vendor Blocking Sidewalk",
    description: "Sidewalk is blocked by illegal vendors.",
    category: "others",
    status: "submitted",
    priority: "low",
    complainantName: "Dennis Yap",
    complainantId: "user18",
    location: {
      latitude: 14.321109,
      longitude: 121.099334,
      address: "Near Elementary School",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-12-21T14:10:00"),
    updatedAt: new Date("2025-12-21T14:10:00"),
  },
  {
    id: "c19",
    title: "Damaged Waiting Shed",
    description: "Roof of waiting shed is partially collapsed.",
    category: "infrastructure",
    status: "scheduled",
    priority: "high",
    complainantName: "Leo Bautista",
    complainantId: "user19",
    location: {
      latitude: 14.328901,
      longitude: 121.104876,
      address: "Jeepney Stop Zone",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    scheduledAt: new Date("2025-12-28T09:00:00"),
    createdAt: new Date("2025-12-25T12:45:00"),
    updatedAt: new Date("2025-12-25T12:45:00"),
  },
  {
    id: "c20",
    title: "Overgrown Grass on Vacant Lot",
    description: "Tall grass attracting mosquitoes.",
    category: "sanitation",
    status: "submitted",
    priority: "medium",
    complainantName: "Melanie Cruz",
    complainantId: "user20",
    location: {
      latitude: 14.313772,
      longitude: 121.108445,
      address: "Vacant Lot beside Chapel",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    createdAt: new Date("2025-12-28T08:55:00"),
    updatedAt: new Date("2025-12-28T08:55:00"),
  },
];


// Create Context
const ComplaintDbContext = createContext<ComplaintDbContextType | undefined>(
  undefined
);

// Provider Component
export function ComplaintDbProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  // Helper function to generate unique IDs
  const generateId = (prefix: string): string => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

  // AI-based function to determine category from complaint content
  const determineCategory = (title: string, description: string): ComplaintCategory => {
    const text = `${title} ${description}`.toLowerCase();

    // Infrastructure keywords
    if (/street|light|road|pothole|bridge|pavement|sidewalk|concrete|broken|damage|repair|fix/.test(text)) {
      return 'infrastructure';
    }
    // Sanitation keywords
    if (/garbage|trash|waste|dirty|clean|smell|odor|sanitation|toilet|bathroom|sewer/.test(text)) {
      return 'sanitation';
    }
    // Public safety keywords
    if (/safety|dangerous|hazard|crime|security|theft|robbery|assault|violence|weapon/.test(text)) {
      return 'public_safety';
    }
    // Traffic keywords
    if (/traffic|vehicle|parking|car|motorcycle|congestion|jam|road block/.test(text)) {
      return 'traffic';
    }
    // Water/Electricity keywords
    if (/water|electricity|electric|power|outage|supply|leak|pipe|wire|voltage/.test(text)) {
      return 'water_electricity';
    }
    // Noise keywords
    if (/noise|loud|sound|music|construction|disturbance|noisy/.test(text)) {
      return 'noise';
    }
    // Domestic keywords
    if (/domestic|family|household|neighbor|dispute|argument/.test(text)) {
      return 'domestic';
    }
    // Environment keywords
    if (/environment|pollution|tree|plant|flood|drainage|air quality|smoke/.test(text)) {
      return 'environment';
    }

    return 'others';
  };

  // AI-based function to determine priority from complaint content
  const determinePriority = (title: string, description: string, category: ComplaintCategory): "low" | "medium" | "high" | "urgent" => {
    const text = `${title} ${description}`.toLowerCase();

    // Urgent keywords
    if (/urgent|emergency|immediate|danger|critical|serious|life threatening|injured|fire|flood|electrocution/.test(text)) {
      return 'urgent';
    }

    // High priority keywords
    if (/broken|damage|accident|unsafe|hazard|risk|concern|problem|blocked|overflow/.test(text)) {
      return 'high';
    }

    // Public safety and water/electricity are typically high priority
    if (category === 'public_safety' || category === 'water_electricity') {
      return 'high';
    }

    // Medium priority keywords
    if (/need|require|should|must|important|affect/.test(text)) {
      return 'medium';
    }

    // Default to low
    return 'low';
  };

  const createComplaint = (input: CreateComplaintInput): Complaint => {
    // Determine category and priority using AI-based logic
    const category = determineCategory(input.title, input.description);
    const priority = determinePriority(input.title, input.description, category);

    const newComplaint: Complaint = {
      id: generateId('c'),
      title: input.title,
      description: input.description,
      category,
      status: 'submitted',
      priority,
      complainantName: 'Anonymous User', // Will be replaced with actual user data
      complainantId: `user-${Math.floor(Math.random() * 1000)}`, // Will be replaced with actual user ID
      location: input.location!,
      images: input.images,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const deleteComplaint = (id: string): boolean => {
    const initialLength = complaints.length;
    setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
    return complaints.length !== initialLength;
  };

  const updateComplaintStatus = (
    id: string,
    status: ComplaintStatus,
    scheduledAt?: Date,
    resolutionDetails?: ResolutionDetail
  ): Complaint | null => {
    let updatedComplaint: Complaint | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          const updateData: any = { status };

          // Set resolvedAt timestamp and resolutionDetails when marking as resolved
          if (status === "resolved") {
            updateData.resolvedAt = new Date();
            if (resolutionDetails) {
              updateData.resolutionDetails = resolutionDetails;
            }
          } else if (complaint.status === "resolved") {
            // Clear resolvedAt, resolutionDetails, and actualCompletionDate if changing from resolved to another status
            updateData.resolvedAt = undefined;
            updateData.resolutionDetails = undefined;
            updateData.actualCompletionDate = undefined;
          }

          // Set scheduledAt timestamp when marking as scheduled
          if (status === "scheduled") {
            updateData.scheduledAt = scheduledAt || new Date();
          } else if (status === "submitted" || status === "under_review" || status === "dismissed") {
            // Clear scheduledAt when changing to submitted, under_review, or dismissed
            updateData.scheduledAt = undefined;
          }

          const updated = {
            ...complaint,
            ...updateData,
            updatedAt: new Date(),
          };
          
          // Explicitly remove undefined fields only when they were set to undefined
          if (updateData.hasOwnProperty('resolvedAt') && updateData.resolvedAt === undefined) delete updated.resolvedAt;
          if (updateData.hasOwnProperty('resolutionDetails') && updateData.resolutionDetails === undefined) delete updated.resolutionDetails;
          if (updateData.hasOwnProperty('actualCompletionDate') && updateData.actualCompletionDate === undefined) delete updated.actualCompletionDate;
          if (updateData.hasOwnProperty('scheduledAt') && updateData.scheduledAt === undefined) delete updated.scheduledAt;
          
          updatedComplaint = updated;
          return updated;
        }
        return complaint;
      })
    );

    return updatedComplaint;
  };

  const addComplaintComment = (
    complaintId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ): Comment | null => {
    let newComment: Comment | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          newComment = {
            id: generateId("comment"),
            userId,
            userName,
            content,
            isAdmin,
            likes: [],
            dislikes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          return {
            ...complaint,
            comments: [...(complaint.comments || []), newComment],
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return newComment;
  };

  const addReply = (
    complaintId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ): Reply | null => {
    let newReply: Reply | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          const updatedComments = (complaint.comments || []).map((comment: Comment) => {
            if (comment.id === commentId) {
              newReply = {
                id: generateId("reply"),
                userId,
                userName,
                content,
                isAdmin,
                likes: [],
                dislikes: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
                updatedAt: new Date(),
              };
            }
            return comment;
          });

          return {
            ...complaint,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return complaint;
      })
    );

    return newReply;
  };

  const generateAIAnalysis = async (complaintId: string): Promise<ComplaintAiAnalysis> => {
    const complaint = complaints.find((c) => c.id === complaintId);

    if (!complaint) {
      throw new Error("Complaint not found");
    }

    // Simulate AI analysis generation with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const getCategoryLabel = (category: ComplaintCategory) => {
      const labels: Record<ComplaintCategory, string> = {
        noise: "Noise",
        sanitation: "Sanitation",
        public_safety: "Public Safety",
        traffic: "Traffic",
        infrastructure: "Infrastructure",
        water_electricity: "Water/Electricity",
        domestic: "Domestic",
        environment: "Environment",
        others: "Others",
      };
      return labels[category];
    };

    // Generate structured AI analysis
    const aiAnalysis: ComplaintAiAnalysis = {
      summary: `This ${getCategoryLabel(complaint.category).toLowerCase()} complaint titled "${complaint.title}" requires ${complaint.priority === 'urgent' || complaint.priority === 'high' ? 'immediate' : 'standard'} attention. ${complaint.description.substring(0, 100)}...`,

      suggestedSolution: complaint.category === 'infrastructure'
        ? '1. Conduct site inspection\n2. Assess damage extent\n3. Prepare materials and equipment\n4. Execute repairs with proper safety measures\n5. Test and verify functionality\n6. Clean up site and document completion'
        : complaint.category === 'sanitation'
          ? '1. Deploy sanitation team immediately\n2. Clear and clean affected area\n3. Sanitize and disinfect the location\n4. Schedule regular maintenance\n5. Monitor for recurrence\n6. Educate residents on proper waste disposal'
          : complaint.category === 'noise'
            ? '1. Verify noise complaint with site visit\n2. Check permits and regulations\n3. Meet with complainant and source\n4. Establish acceptable noise hours\n5. Issue warnings if necessary\n6. Follow up to ensure compliance'
            : '1. Investigate the reported issue\n2. Document findings and evidence\n3. Consult with relevant authorities\n4. Develop action plan\n5. Implement solution\n6. Follow up with complainant',

      requiredResources: complaint.category === 'infrastructure'
        ? ['Tools and equipment', 'Replacement parts', 'Safety gear', 'Transport vehicle']
        : complaint.category === 'sanitation'
          ? ['Cleaning supplies', 'Disinfectants', 'Protective equipment', 'Garbage bags', 'Collection truck']
          : complaint.category === 'water_electricity'
            ? ['Technical tools', 'Replacement components', 'Testing equipment', 'Safety gear']
            : ['Basic tools', 'Documentation materials', 'Communication devices'],

      estimatedManpower: complaint.priority === 'urgent'
        ? '4-6 personnel (emergency response team)'
        : complaint.priority === 'high'
          ? '3-4 personnel (priority team)'
          : '2-3 personnel (standard team)',

      estimatedTimeframe: complaint.priority === 'urgent'
        ? '24-48 hours (immediate response required)'
        : complaint.priority === 'high'
          ? '3-5 days (expedited timeline)'
          : complaint.priority === 'medium'
            ? '1-2 weeks (standard processing)'
            : '2-4 weeks (routine maintenance)',

      departmentRouting: complaint.category === 'infrastructure'
        ? 'Public Works & Infrastructure Committee'
        : complaint.category === 'sanitation'
          ? 'Health & Sanitation Committee'
          : complaint.category === 'public_safety'
            ? 'Peace & Order Committee'
            : complaint.category === 'traffic'
              ? 'Traffic Management Committee'
              : complaint.category === 'water_electricity'
                ? 'Utilities & Services Committee'
                : complaint.category === 'environment'
                  ? 'Environmental Protection Committee'
                  : 'General Services Committee',

      budgetEstimate: complaint.priority === 'urgent'
        ? '₱15,000 - ₱50,000'
        : complaint.priority === 'high'
          ? '₱10,000 - ₱30,000'
          : '₱5,000 - ₱20,000',

      publicSafetyRisk: complaint.category === 'public_safety'
        ? 'High - Immediate safety concerns for residents'
        : complaint.category === 'infrastructure'
          ? 'Medium - Potential for accidents or injuries'
          : complaint.category === 'water_electricity'
            ? 'Medium - Risk of service disruption or hazards'
            : complaint.priority === 'urgent'
              ? 'Medium - Requires prompt attention'
              : 'Low - No immediate safety threats',

      preventionAdvice: complaint.category === 'infrastructure'
        ? 'Implement regular maintenance schedule and quarterly infrastructure inspections. Establish early warning system for deteriorating facilities.'
        : complaint.category === 'sanitation'
          ? 'Increase collection frequency in high-traffic areas. Conduct community education programs on proper waste disposal. Install additional bins where needed.'
          : complaint.category === 'noise'
            ? 'Enforce community noise ordinances. Establish clear guidelines for construction hours. Create community awareness programs.'
            : complaint.category === 'public_safety'
              ? 'Enhance barangay patrol schedules. Improve lighting in vulnerable areas. Establish community watch programs.'
              : 'Conduct regular monitoring and preventive maintenance. Establish community feedback channels for early issue detection.',
    };

    // Update the complaint with the generated AI analysis
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            aiAnalysis,
            updatedAt: new Date(),
          };
        }
        return c;
      })
    );

    return aiAnalysis;
  };

  const generateCommunitySentiment = async (complaintId: string): Promise<void> => {
    const complaint = complaints.find((c) => c.id === complaintId);

    if (!complaint) {
      throw new Error("Complaint not found");
    }

    // Simulate AI sentiment analysis generation with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate random sentiment
    const sentiments: Array<'supportive' | 'positive' | 'negative' | 'neutral'> = ['supportive', 'positive', 'negative', 'neutral'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    // Generate realistic summary based on sentiment
    const summaries = {
      supportive: 'Community shows strong support for this issue. Residents are actively engaged and encouraging resolution.',
      positive: 'Community feedback is generally positive. Residents appreciate the attention to this matter.',
      negative: 'Community expresses concerns about this issue. Some residents are frustrated with the situation.',
      neutral: 'Community engagement is moderate. Residents are monitoring the situation.'
    };

    const communitySentiment: CommunitySentiment = {
      sentiment,
      summary: summaries[sentiment]
    };

    // Update the complaint with the generated community sentiment
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            communitySentiment,
            updatedAt: new Date(),
          };
        }
        return c;
      })
    );
  };

  const getComplaint = (id: string): Complaint | undefined => {
    return complaints.find((complaint) => complaint.id === id);
  };

  const value: ComplaintDbContextType = {
    complaints,
    createComplaint,
    getComplaint,
    deleteComplaint,
    updateComplaintStatus,
    addComplaintComment,
    addReply,
    generateAIAnalysis,
    generateCommunitySentiment,
  };

  return (
    <ComplaintDbContext.Provider value={value}>
      {children}
    </ComplaintDbContext.Provider>
  );
}

// Custom hook to use the context
export function useComplaintDb() {
  const context = useContext(ComplaintDbContext);
  if (context === undefined) {
    throw new Error("useComplaintDb must be used within a ComplaintDbProvider");
  }
  return context;
}
