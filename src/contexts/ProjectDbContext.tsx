import { createContext, useContext, useState, ReactNode } from "react";
import type {
  ProjectCategory,
  ProjectStatus,
  ProjectLocation,
  ProgressUpdate,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "../types/project";

import type { Image, Reply, Comment, CommunitySentiment } from "../types/shared";

// Re-export types for backward compatibility
export type {
  Image,
  Reply,
  Comment,
  ProjectCategory,
  ProjectStatus,
  ProjectLocation,
  ProgressUpdate,
  CommunitySentiment,
  Project,
  CreateProjectInput,
  UpdateProjectInput,
};

// Context types
interface ProjectDbContextType {
  projects: Project[];
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (id: string, input: UpdateProjectInput) => Project | null;
  deleteProject: (id: string) => boolean;
  addProjectComment: (
    projectId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ) => Comment | null;
  addReply: (
    projectId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ) => Reply | null;
  generateCommunitySentiment: (projectId: string) => Promise<void>;
}

// Initial dummy data
const initialProjects: Project[] = [
  {
    id: "p1",
    title: "Community Health Center Renovation",
    description: "Complete renovation of the barangay health center including new equipment, upgraded facilities, and improved waiting areas.",
    category: "health",
    status: "ongoing",
    startDate: new Date("2025-11-01"),
    expectedCompletionDate: new Date("2026-02-28"),
    budget: 2500000,
    contractor: "ABC Construction Corp.",
    sourceOfFunds: "Municipal Budget 2025",
    location: {
      latitude: 14.308423,
      longitude: 121.045678,
      address: "123 Health Street, Barangay Central",
    },
    images: [
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
    ],
    progressPercentage: 65,
    progressUpdates: [
      {
        description: "Foundation work completed. Starting wall construction.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-11-15T10:00:00"),
      },
      {
        description: "Electrical and plumbing installations in progress.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-12-10T14:30:00"),
      },
    ],
    likes: ["user1", "user2", "user3", "user4"],
    dislikes: [],
    comments: [
      {
        id: "pcomment1",
        userId: "user1",
        userName: "Juan Dela Cruz",
        content: "Great initiative! Looking forward to the completion.",
        likes: ["user2", "user3"],
        dislikes: [],
        replies: [
          {
            id: "preply1",
            userId: "admin1",
            userName: "Barangay Admin",
            content: "Thank you for your support! We're working hard to complete this on schedule.",
            isAdmin: true,
            likes: ["user1"],
            dislikes: [],
            createdAt: new Date("2025-11-05T14:30:00"),
            updatedAt: new Date("2025-11-05T14:30:00"),
          },
        ],
        createdAt: new Date("2025-11-05T10:00:00"),
        updatedAt: new Date("2025-11-05T10:00:00"),
      },
    ],
    createdAt: new Date("2025-10-15T09:00:00"),
    updatedAt: new Date("2025-12-20T14:30:00"),
  },
  {
    id: "p2",
    title: "Street Lighting Installation Project",
    description: "Installation of 50 new LED street lights across major roads and alleys to improve nighttime safety and security.",
    category: "infrastructure",
    status: "approved",
    startDate: new Date("2026-01-15"),
    expectedCompletionDate: new Date("2026-03-31"),
    budget: 1800000,
    contractor: "LightWorks Inc.",
    sourceOfFunds: "DILG Grant",
    location: {
      latitude: 14.306956,
      longitude: 121.042345,
      address: "Various locations across the barangay",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 0,
    likes: ["user1", "user2", "user5"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-12-01T08:30:00"),
    updatedAt: new Date("2025-12-15T11:20:00"),
  },
  {
    id: "p3",
    title: "Waste Management and Recycling Program",
    description: "Implementation of a comprehensive waste segregation and recycling program including distribution of color-coded bins and weekly collection schedules.",
    category: "environment",
    status: "ongoing",
    startDate: new Date("2025-10-01"),
    expectedCompletionDate: new Date("2026-12-31"),
    budget: 850000,
    contractor: "GreenEarth Solutions",
    sourceOfFunds: "Environmental Fund",
    location: {
      latitude: 14.306063,
      longitude: 121.047574,
      address: "Barangay-wide implementation",
    },
    images: [
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
    ],
    progressPercentage: 40,
    progressUpdates: [
      {
        description: "Distributed color-coded bins to Zone 1 and Zone 2.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-10-20T09:00:00"),
      },
    ],
    likes: ["user2", "user3", "user4", "user5", "user6"],
    dislikes: [],
    comments: [
      {
        id: "pcomment2",
        userId: "user3",
        userName: "Pedro Reyes",
        content: "This is exactly what we need! Great job!",
        likes: ["user1", "user2", "user4"],
        dislikes: [],
        createdAt: new Date("2025-10-10T14:20:00"),
        updatedAt: new Date("2025-10-10T14:20:00"),
      },
      {
        id: "pcomment3",
        userId: "user4",
        userName: "Ana Lopez",
        content: "When will we receive the bins in our area?",
        likes: ["user5"],
        dislikes: [],
        createdAt: new Date("2025-10-15T09:30:00"),
        updatedAt: new Date("2025-10-15T09:30:00"),
      },
    ],
    createdAt: new Date("2025-09-20T10:00:00"),
    updatedAt: new Date("2025-12-18T16:45:00"),
  },
  {
    id: "p4",
    title: "Multipurpose Sports Complex",
    description: "Construction of a new multipurpose sports complex with basketball and volleyball courts, covered stage, and community hall.",
    category: "sports_culture",
    status: "planned",
    startDate: new Date("2026-06-01"),
    expectedCompletionDate: new Date("2027-03-31"),
    budget: 5000000,
    sourceOfFunds: "Provincial Development Fund",
    location: {
      latitude: 14.309511,
      longitude: 121.050442,
      address: "Corner of Sports Ave and Recreation St.",
    },
    images: [
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
      { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
    ],
    progressPercentage: 0,
    likes: ["user1", "user3", "user5"],
    dislikes: [],
    comments: [],
    createdAt: new Date("2025-12-10T11:00:00"),
    updatedAt: new Date("2025-12-10T11:00:00"),
  },
  {
    id: "p5",
    title: "Barangay Water Supply Improvement",
    description: "Installation of additional water pumps and pipelines to ensure reliable water supply for all households.",
    category: "infrastructure",
    status: "ongoing",
    startDate: new Date("2025-09-15"),
    expectedCompletionDate: new Date("2026-03-15"),
    budget: 2000000,
    contractor: "AquaFlow Solutions",
    sourceOfFunds: "Barangay Infrastructure Fund",
    location: {
      latitude: 14.308070,
      longitude: 121.052176,
      address: "Zone 2 and Zone 3 residential areas",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 35,
    progressUpdates: [
      {
        description: "Water pipeline trenching completed in Zone 2.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-10-05T10:00:00"),
      },
      {
        description: "Pump installation started in Zone 3.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-11-12T14:30:00"),
      },
    ],
    likes: ["user2", "user4", "user5"],
    dislikes: [],
    comments: [
      {
        id: "pcomment21",
        userId: "user3",
        userName: "Ramon Cruz",
        content: "Finally! Our area has been waiting for this upgrade.",
        likes: ["user1", "user5"],
        dislikes: [],
        createdAt: new Date("2025-09-20T09:30:00"),
        updatedAt: new Date("2025-09-20T09:30:00"),
      },
    ],
    createdAt: new Date("2025-09-10T08:00:00"),
    updatedAt: new Date("2025-12-20T12:00:00"),
  },
  {
    id: "p6",
    title: "Flood Control and Drainage System",
    description: "Improvement of drainage systems and construction of flood control infrastructure in flood-prone areas.",
    category: "disaster_preparedness",
    status: "completed",
    startDate: new Date("2025-03-01"),
    expectedCompletionDate: new Date("2025-10-31"),
    actualCompletionDate: new Date("2025-10-28"),
    budget: 3200000,
    contractor: "FloodSafe Engineering",
    sourceOfFunds: "Disaster Risk Reduction Fund",
    location: {
      latitude: 14.308977,
      longitude: 121.047194,
      address: "Low-lying areas, Zone 3 and 4",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 100,
    progressUpdates: [
      {
        description: "Excavation and drainage pipe installation in Zone 3 completed.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-05-15T13:00:00"),
      },
      {
        description: "Zone 4 flood control infrastructure completed. Final testing in progress.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-09-20T10:30:00"),
      },
      {
        description: "All work completed successfully. System operational.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-10-28T16:00:00"),
      },
    ],
    likes: ["user1", "user2", "user3"],
    dislikes: [],
    comments: [
      {
        id: "pcomment5",
        userId: "user6",
        userName: "Linda Torres",
        content: "The flooding has significantly reduced! Great work!",
        likes: ["user1", "user2", "user3", "user4", "user5"],
        dislikes: [],
        createdAt: new Date("2025-11-15T16:30:00"),
        updatedAt: new Date("2025-11-15T16:30:00"),
      },
    ],
    createdAt: new Date("2025-02-01T08:00:00"),
    updatedAt: new Date("2025-11-01T17:00:00"),
  },
  {
    id: "p7",
    title: "Barangay Road Resurfacing",
    description: "Resurfacing of damaged internal roads to improve accessibility.",
    category: "infrastructure",
    status: "ongoing",
    startDate: new Date("2025-09-01"),
    expectedCompletionDate: new Date("2026-01-31"),
    budget: 2100000,
    contractor: "SolidPath Builders",
    sourceOfFunds: "Barangay Infrastructure Fund",
    location: {
      latitude: 14.307567,
      longitude: 121.046789,
      address: "Main Road, Zone 2",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 55,
    progressUpdates: [
      {
        description: "Asphalt laying completed for Phase 1.",
        image: { uri: `https://picsum.photos/seed/${Math.random()}/1280/720` },
        createdAt: new Date("2025-11-20"),
      },
    ],
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-12-10"),
  },
  {
    id: "p8",
    title: "Senior Citizens Wellness Program",
    description: "Monthly health checks and wellness activities for senior citizens.",
    category: "social_services",
    status: "ongoing",
    startDate: new Date("2025-07-01"),
    expectedCompletionDate: new Date("2026-06-30"),
    budget: 600000,
    sourceOfFunds: "Social Welfare Budget",
    location: {
      latitude: 14.309411,
      longitude: 121.052616,
      address: "Barangay Hall",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 70,
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2025-12-05"),
  },
  {
    id: "p9",
    title: "Community Tree Planting Drive",
    description: "Planting 1,000 trees along riverbanks and open spaces.",
    category: "environment",
    status: "completed",
    startDate: new Date("2025-05-01"),
    actualCompletionDate: new Date("2025-08-15"),
    budget: 300000,
    sourceOfFunds: "Environmental Fund",
    location: {
      latitude: 14.305456,
      longitude: 121.043234,
      address: "Riverbank Area",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 100,
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-08-20"),
  },
  {
    id: "p10",
    title: "Barangay Free Wi-Fi Project",
    description: "Installation of free public Wi-Fi hotspots in key areas.",
    category: "infrastructure",
    status: "approved",
    startDate: new Date("2026-02-01"),
    expectedCompletionDate: new Date("2026-05-31"),
    budget: 950000,
    contractor: "NetConnect PH",
    sourceOfFunds: "DICTS Grant",
    location: {
      latitude: 14.308475,
      longitude: 121.051222,
      address: "Public Plaza & Hall",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 0,
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2025-12-01"),
  },
  {
    id: "p11",
    title: "Livelihood Skills Training",
    description: "Skills training on food processing and small business management.",
    category: "livelihood",
    status: "ongoing",
    startDate: new Date("2025-08-01"),
    expectedCompletionDate: new Date("2026-02-28"),
    budget: 480000,
    sourceOfFunds: "TESDA Partnership",
    location: {
      latitude: 14.309678,
      longitude: 121.049456,
      address: "Training Center, Zone 5",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 60,
    createdAt: new Date("2025-07-15"),
    updatedAt: new Date("2025-12-18"),
  },
  {
    id: "p12",
    title: "Public Market Sanitation Upgrade",
    description: "Improved drainage, waste disposal, and sanitation facilities.",
    category: "health",
    status: "ongoing",
    startDate: new Date("2025-10-01"),
    expectedCompletionDate: new Date("2026-01-31"),
    budget: 1300000,
    contractor: "CleanBuild Services",
    location: {
      latitude: 14.307851,
      longitude: 121.050299,
      address: "Barangay Public Market",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 45,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-12-12"),
  },
  {
    id: "p13",
    title: "Disaster Response Equipment Acquisition",
    description: "Purchase of rescue boats, vests, and emergency kits.",
    category: "disaster_preparedness",
    status: "completed",
    startDate: new Date("2025-04-01"),
    actualCompletionDate: new Date("2025-06-15"),
    budget: 900000,
    sourceOfFunds: "DRRM Fund",
    location: {
      latitude: 14.306789,
      longitude: 121.047234,
      address: "Barangay DRRM Office",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 100,
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-06-20"),
  },
  {
    id: "p14",
    title: "Youth Sports Development Program",
    description: "Training clinics for basketball and volleyball athletes.",
    category: "sports_culture",
    status: "ongoing",
    startDate: new Date("2025-06-15"),
    expectedCompletionDate: new Date("2026-06-14"),
    budget: 520000,
    location: {
      latitude: 14.307269,
      longitude: 121.049162,
      address: "Covered Court",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 75,
    createdAt: new Date("2025-05-20"),
    updatedAt: new Date("2025-12-08"),
  },
  {
    id: "p15",
    title: "Barangay Library Modernization",
    description: "Upgrading library facilities with computers and learning materials.",
    category: "education",
    status: "planned",
    startDate: new Date("2026-04-01"),
    expectedCompletionDate: new Date("2026-10-31"),
    budget: 1100000,
    location: {
      latitude: 14.304567,
      longitude: 121.045123,
      address: "Old Library Building",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 0,
    createdAt: new Date("2025-12-05"),
    updatedAt: new Date("2025-12-05"),
  },
  {
    id: "p16",
    title: "Community Feeding Program",
    description: "Weekly feeding program for undernourished children.",
    category: "health",
    status: "ongoing",
    startDate: new Date("2025-05-01"),
    expectedCompletionDate: new Date("2026-04-30"),
    budget: 700000,
    location: {
      latitude: 14.308678,
      longitude: 121.049678,
      address: "Day Care Centers",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 85,
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-12-15"),
  },
  {
    id: "p17",
    title: "Barangay CCTV Expansion",
    description: "Installation of additional CCTV cameras in blind spots.",
    category: "infrastructure",
    status: "approved",
    startDate: new Date("2026-01-10"),
    expectedCompletionDate: new Date("2026-04-30"),
    budget: 1600000,
    location: {
      latitude: 14.308234,
      longitude: 121.048567,
      address: "Various Zones",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 0,
    createdAt: new Date("2025-12-18"),
    updatedAt: new Date("2025-12-18"),
  },
  {
    id: "p18",
    title: "Women Entrepreneurship Program",
    description: "Support program for women-led micro-businesses.",
    category: "livelihood",
    status: "ongoing",
    startDate: new Date("2025-07-01"),
    expectedCompletionDate: new Date("2026-03-31"),
    budget: 650000,
    location: {
      latitude: 14.307891,
      longitude: 121.042789,
      address: "Livelihood Office",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 50,
    createdAt: new Date("2025-06-10"),
    updatedAt: new Date("2025-12-01"),
  },
  {
    id: "p19",
    title: "Barangay Clean-Up Drive",
    description: "Monthly clean-up activities across all zones.",
    category: "environment",
    status: "ongoing",
    startDate: new Date("2025-01-01"),
    expectedCompletionDate: new Date("2025-12-31"),
    budget: 200000,
    location: {
      latitude: 14.306234,
      longitude: 121.046345,
      address: "Barangay-wide",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 90,
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2025-12-20"),
  },
  {
    id: "p20",
    title: "Public Restroom Construction",
    description: "Construction of accessible public restrooms near the plaza.",
    category: "infrastructure",
    status: "cancelled",
    startDate: new Date("2025-08-01"),
    budget: 750000,
    location: {
      latitude: 14.309317,
      longitude: 121.051962,
      address: "Barangay Plaza",
    },
    images: [{ uri: `https://picsum.photos/seed/${Math.random()}/1280/720` }],
    progressPercentage: 10,
    createdAt: new Date("2025-07-01"),
    updatedAt: new Date("2025-10-01"),
  }
];

// Create Context
const ProjectDbContext = createContext<ProjectDbContextType | undefined>(
  undefined
);

// Provider Component
export function ProjectDbProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Helper function to generate unique IDs
  const generateId = (prefix: string): string => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

  const createProject = (input: CreateProjectInput): Project => {
    const newProject: Project = {
      ...input,
      id: generateId("p"),
      progressPercentage: 0,
      progressUpdates: [],
      likes: [],
      dislikes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (
    id: string,
    input: UpdateProjectInput
  ): Project | null => {
    let updatedProject: Project | null = null;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === id) {
          updatedProject = {
            ...project,
            ...input,
            updatedAt: new Date(),
          };
          return updatedProject;
        }
        return project;
      })
    );

    return updatedProject;
  };

  const deleteProject = (id: string): boolean => {
    const initialLength = projects.length;
    setProjects((prev) => prev.filter((project) => project.id !== id));
    return projects.length !== initialLength;
  };

  const addProjectComment = (
    projectId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ): Comment | null => {
    let newComment: Comment | null = null;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          newComment = {
            id: generateId("pcomment"),
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
            ...project,
            comments: [...(project.comments || []), newComment],
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return newComment;
  };

  const addReply = (
    projectId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
    isAdmin?: boolean
  ): Reply | null => {
    let newReply: Reply | null = null;

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          const updatedComments = (project.comments || []).map((comment: Comment) => {
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
            ...project,
            comments: updatedComments,
            updatedAt: new Date(),
          };
        }
        return project;
      })
    );

    return newReply;
  };

  const generateCommunitySentiment = async (projectId: string): Promise<void> => {
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    // Simulate AI sentiment analysis generation with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate random sentiment
    const sentiments: Array<'supportive' | 'positive' | 'negative' | 'neutral'> = ['supportive', 'positive', 'negative', 'neutral'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    // Generate realistic summary based on sentiment
    const summaries = {
      supportive: 'Community shows strong support for this project. Residents are excited about the positive impact.',
      positive: 'Community feedback is generally positive. Residents appreciate the initiative and progress.',
      negative: 'Community expresses concerns about this project. Some residents have reservations about the implementation.',
      neutral: 'Community engagement is moderate. Residents are monitoring the project development.'
    };

    const communitySentiment: CommunitySentiment = {
      sentiment,
      summary: summaries[sentiment]
    };

    // Update the project with the generated community sentiment
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            communitySentiment,
            updatedAt: new Date(),
          };
        }
        return p;
      })
    );
  };

  const value: ProjectDbContextType = {
    projects,
    createProject,
    updateProject,
    deleteProject,
    addProjectComment,
    addReply,
    generateCommunitySentiment,
  };

  return (
    <ProjectDbContext.Provider value={value}>
      {children}
    </ProjectDbContext.Provider>
  );
}

// Custom hook to use the context
export function useProjectDb() {
  const context = useContext(ProjectDbContext);
  if (context === undefined) {
    throw new Error("useProjectDb must be used within a ProjectDbProvider");
  }
  return context;
}
