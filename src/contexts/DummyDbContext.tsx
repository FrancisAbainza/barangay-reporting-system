import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Complaint,
  CreateComplaintInput,
  UpdateComplaintInput,
  Project,
} from '../types/dummyDb';

// Initial dummy data
const initialComplaints: Complaint[] = [
  {
    id: 'complaint-1',
    title: 'Loud noise from construction site',
    description: 'Construction work starts at 6 AM and creates excessive noise that disturbs residents.',
    category: 'noise',
    status: 'under_review',
    complainantName: 'Juan dela Cruz',
    complainantId: 'user-001',
    location: {
      latitude: 14.599500,
      longitude: 120.984200,
    },
    images: [],
    likes: ['user-002', 'user-003', 'user-005', 'user-007'],
    dislikes: ['user-010'],
    comments: [
      {
        id: 'comment-1',
        userId: 'user-002',
        userName: 'Maria Santos',
        content: 'I live nearby and can confirm this is a serious issue. The noise is unbearable.',
        likes: ['user-001', 'user-003'],
        createdAt: new Date('2025-12-15T10:30:00'),
        updatedAt: new Date('2025-12-15T10:30:00'),
      },
      {
        id: 'comment-2',
        userId: 'user-003',
        userName: 'Pedro Reyes',
        content: 'Has anyone contacted the construction company about this?',
        likes: ['user-001'],
        dislikes: [],
        createdAt: new Date('2025-12-16T08:15:00'),
        updatedAt: new Date('2025-12-16T08:15:00'),
      },
    ],
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2025-12-16'),
  },
  {
    id: 'complaint-2',
    title: 'Uncollected garbage on street',
    description: 'Garbage has not been collected for over a week, causing foul odor and health concerns.',
    category: 'sanitation',
    status: 'scheduled',
    complainantName: 'Maria Santos',
    complainantId: 'user-002',
    location: {
      latitude: 14.598500,
      longitude: 120.985200,
    },
    images: [],
    likes: ['user-001', 'user-004', 'user-006', 'user-008', 'user-009'],
    dislikes: [],
    comments: [
      {
        id: 'comment-3',
        userId: 'user-004',
        userName: 'Ana Garcia',
        content: 'This is becoming a health hazard. Please prioritize this issue.',
        likes: ['user-002', 'user-006', 'user-008'],
        createdAt: new Date('2025-12-14T14:20:00'),
        updatedAt: new Date('2025-12-14T14:20:00'),
      },
    ],
    createdAt: new Date('2025-12-14'),
    updatedAt: new Date('2025-12-17'),
  },
  {
    id: 'complaint-3',
    title: 'Broken streetlight near corner',
    description: 'The streetlight has been non-functional for two weeks, creating safety concerns at night.',
    category: 'public_safety',
    status: 'in_progress',
    complainantName: 'Pedro Reyes',
    complainantId: 'user-003',
    location: {
      latitude: 14.600500,
      longitude: 120.983200,
    },
    images: [],
    likes: ['user-001', 'user-002', 'user-005'],
    dislikes: [],
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2025-12-18'),
  },
  {
    id: 'complaint-4',
    title: 'Pothole on main road',
    description: 'Large pothole causing damage to vehicles and hazardous for motorcycles.',
    category: 'infrastructure',
    status: 'resolved',
    complainantName: 'Ana Garcia',
    complainantId: 'user-004',
    location: {
      latitude: 14.601500,
      longitude: 120.982200,
    },
    images: [],
    createdAt: new Date('2025-12-08'),
    updatedAt: new Date('2025-12-19'),
  },
  {
    id: 'complaint-5',
    title: 'Water supply interruption',
    description: 'No water supply for the past 48 hours in our area.',
    category: 'water_electricity',
    status: 'submitted',
    complainantName: 'Roberto Tan',
    complainantId: 'user-005',
    location: {
      latitude: 14.597500,
      longitude: 120.986200,
    },
    images: [],
    createdAt: new Date('2025-12-19'),
    updatedAt: new Date('2025-12-19'),
  },
];

const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Multi-Purpose Community Center Construction',
    description: 'Construction of a new multi-purpose community center that will serve as venue for events, meetings, and recreational activities.',
    category: 'infrastructure',
    status: 'ongoing',
    startDate: new Date('2025-11-01'),
    endDate: new Date('2026-06-30'),
    budget: 5000000,
    contractor: 'ABC Construction Corporation',
    sourceOfFunds: 'Local Government Unit Budget',
    location: {
      latitude: 14.599500,
      longitude: 120.984200,
    },
    images: [],
    likes: ['user-001', 'user-002', 'user-003', 'user-005', 'user-007', 'user-009'],
    dislikes: ['user-011'],
    comments: [
      {
        id: 'project-comment-1',
        userId: 'user-002',
        userName: 'Maria Santos',
        content: 'This is a great project! The community really needs this facility.',
        likes: ['user-001', 'user-003', 'user-005'],
        createdAt: new Date('2025-11-10T09:00:00'),
        updatedAt: new Date('2025-11-10T09:00:00'),
      },
      {
        id: 'project-comment-2',
        userId: 'user-007',
        userName: 'Carlos Lopez',
        content: 'When will the construction be completed? Looking forward to using this.',
        likes: ['user-001', 'user-002'],
        createdAt: new Date('2025-11-25T14:30:00'),
        updatedAt: new Date('2025-11-25T14:30:00'),
      },
    ],
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-12-01'),
  },
  {
    id: 'project-2',
    title: 'Street Lighting Upgrade Program',
    description: 'Installation of energy-efficient LED streetlights throughout the barangay to improve safety and reduce electricity costs.',
    category: 'infrastructure',
    status: 'approved',
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-03-31'),
    budget: 800000,
    contractor: 'Bright Light Electric Services',
    sourceOfFunds: 'Provincial Development Fund',
    images: [],
    likes: ['user-003', 'user-004', 'user-008'],
    dislikes: [],
    createdAt: new Date('2025-11-20'),
    updatedAt: new Date('2025-12-10'),
  },
  {
    id: 'project-3',
    title: 'Free Medical Mission & Health Program',
    description: 'Quarterly medical missions providing free check-ups, medicines, and health education to residents.',
    category: 'health',
    status: 'ongoing',
    startDate: new Date('2025-01-01'),
    budget: 300000,
    contractor: 'Community Health Partners',
    sourceOfFunds: 'Department of Health Grant',
    images: [],
    likes: ['user-001', 'user-002', 'user-004', 'user-005', 'user-006', 'user-008', 'user-010'],
    dislikes: [],
    comments: [
      {
        id: 'project-comment-3',
        userId: 'user-004',
        userName: 'Ana Garcia',
        content: 'Thank you for this program! It has helped my family a lot.',
        likes: ['user-001', 'user-002', 'user-005', 'user-006'],
        createdAt: new Date('2025-03-20T11:15:00'),
        updatedAt: new Date('2025-03-20T11:15:00'),
      },
    ],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2025-12-15'),
  },
  {
    id: 'project-4',
    title: 'Scholarship Program for Students',
    description: 'Financial assistance program for elementary and high school students from low-income families.',
    category: 'education',
    status: 'ongoing',
    startDate: new Date('2025-06-01'),
    budget: 500000,
    sourceOfFunds: 'Department of Education Partnership',
    images: [],
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-11-30'),
  },
  {
    id: 'project-5',
    title: 'Waste Segregation and Recycling Program',
    description: 'Implementation of systematic waste segregation and establishment of materials recovery facility.',
    category: 'environment',
    status: 'ongoing',
    startDate: new Date('2025-09-01'),
    budget: 450000,
    contractor: 'Green Solutions Inc.',
    sourceOfFunds: 'Environmental Protection Fund',
    location: {
      latitude: 14.600500,
      longitude: 120.985200,
    },
    images: [],
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-12-05'),
  },
  {
    id: 'project-6',
    title: 'Livelihood Training for Residents',
    description: 'Skills training programs including baking, sewing, and small business management for residents.',
    category: 'livelihood',
    status: 'completed',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2025-08-31'),
    budget: 250000,
    images: [],
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-09-15'),
  },
  {
    id: 'project-7',
    title: 'Disaster Preparedness Equipment Acquisition',
    description: 'Procurement of rescue equipment, emergency supplies, and early warning systems.',
    category: 'disaster_preparedness',
    status: 'planned',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-05-31'),
    budget: 600000,
    images: [],
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2025-12-01'),
  },
  {
    id: 'project-8',
    title: 'Sports Complex Renovation',
    description: 'Renovation and improvement of basketball court, installation of bleachers, and improved lighting.',
    category: 'sports_culture',
    status: 'approved',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-07-31'),
    budget: 1200000,
    location: {
      latitude: 14.601500,
      longitude: 120.983200,
    },
    images: [],
    createdAt: new Date('2025-11-15'),
    updatedAt: new Date('2025-12-18'),
  },
];

interface DummyDbContextType {
  // Complaints state and operations
  complaints: Complaint[];
  createComplaint: (input: CreateComplaintInput) => Complaint;
  getComplaint: (id: string) => Complaint | undefined;
  updateComplaint: (id: string, input: UpdateComplaintInput) => Complaint | null;
  deleteComplaint: (id: string) => boolean;

  // Projects state (read-only)
  projects: Project[];
  getProject: (id: string) => Project | undefined;
}

const DummyDbContext = createContext<DummyDbContextType | undefined>(undefined);

export const DummyDbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [projects] = useState<Project[]>(initialProjects);

  // Complaint CRUD operations
  const createComplaint = (input: CreateComplaintInput): Complaint => {
    const newComplaint: Complaint = {
      id: `complaint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: input.title,
      description: input.description,
      category: input.category,
      status: 'submitted',
      complainantName: 'Anonymous User', // Dummy data
      complainantId: `user-${Math.floor(Math.random() * 1000)}`, // Dummy data
      location: input.location,
      images: input.images,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const getComplaint = (id: string): Complaint | undefined => {
    return complaints.find((complaint) => complaint.id === id);
  };

  const updateComplaint = (id: string, input: UpdateComplaintInput): Complaint | null => {
    let updatedComplaint: Complaint | null = null;

    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === id) {
          updatedComplaint = {
            ...complaint,
            ...input,
            updatedAt: new Date(),
          };
          return updatedComplaint;
        }
        return complaint;
      })
    );

    return updatedComplaint;
  };

  const deleteComplaint = (id: string): boolean => {
    let deleted = false;
    setComplaints((prev) => {
      const filtered = prev.filter((complaint) => complaint.id !== id);
      deleted = filtered.length < prev.length;
      return filtered;
    });
    return deleted;
  };

  // Project read operations
  const getProject = (id: string): Project | undefined => {
    return projects.find((project) => project.id === id);
  };

  const value: DummyDbContextType = {
    complaints,
    createComplaint,
    getComplaint,
    updateComplaint,
    deleteComplaint,
    projects,
    getProject,
  };

  return <DummyDbContext.Provider value={value}>{children}</DummyDbContext.Provider>;
};

export const useDummyDb = (): DummyDbContextType => {
  const context = useContext(DummyDbContext);
  if (!context) {
    throw new Error('useDummyDb must be used within a DummyDbProvider');
  }
  return context;
};
