import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Complaint,
  CreateComplaintInput,
  UpdateComplaintInput,
  Forum,
  CreateForumInput,
  UpdateForumInput,
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
      latitude: 14.5995,
      longitude: 120.9842,
    },
    images: [],
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
      latitude: 14.5985,
      longitude: 120.9852,
    },
    images: [],
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
      latitude: 14.6005,
      longitude: 120.9832,
    },
    images: [],
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
      latitude: 14.6015,
      longitude: 120.9822,
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
      latitude: 14.5975,
      longitude: 120.9862,
    },
    images: [],
    createdAt: new Date('2025-12-19'),
    updatedAt: new Date('2025-12-19'),
  },
];

const initialForums: Forum[] = [
  {
    id: 'forum-1',
    title: 'Community Clean-Up Drive This Weekend',
    description: 'Let\'s organize a clean-up drive this Saturday at 7 AM. Meeting point at the barangay hall. Bring your own gloves and trash bags!',
    authorName: 'Carlos Mendoza',
    authorId: 'user-006',
    createdAt: new Date('2025-12-18'),
    updatedAt: new Date('2025-12-18'),
  },
  {
    id: 'forum-2',
    title: 'Basketball League Registration Now Open',
    description: 'Registration for the annual barangay basketball league is now open. Teams of 10 players can register at the barangay hall until December 30th. Fee: 500 pesos per team.',
    authorName: 'Mike Torres',
    authorId: 'user-007',
    createdAt: new Date('2025-12-16'),
    updatedAt: new Date('2025-12-16'),
  },
  {
    id: 'forum-3',
    title: 'Free Medical Check-up Schedule',
    description: 'The barangay health center will offer free medical check-ups and consultations every Tuesday and Thursday from 9 AM to 12 PM. Please bring your barangay ID.',
    authorName: 'Dr. Lisa Cruz',
    authorId: 'user-008',
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2025-12-15'),
  },
  {
    id: 'forum-4',
    title: 'Community Garden Initiative',
    description: 'We are starting a community garden project. If you\'re interested in growing vegetables and herbs together, please join our planning meeting next Monday at 5 PM at the barangay hall.',
    authorName: 'Elena Ramos',
    authorId: 'user-009',
    createdAt: new Date('2025-12-12'),
    updatedAt: new Date('2025-12-12'),
  },
  {
    id: 'forum-5',
    title: 'Senior Citizens Monthly Meeting',
    description: 'Reminder to all senior citizens: Our monthly meeting and social gathering will be held on December 28th at 2 PM. Snacks will be provided.',
    authorName: 'Gloria Santiago',
    authorId: 'user-010',
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2025-12-10'),
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
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
      address: 'Lot 5, Block 3, Main Street',
    },
    images: [],
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
    images: [],
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
    images: [],
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
    location: {
      latitude: 14.6005,
      longitude: 120.9852,
      address: 'Behind Barangay Hall',
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
      latitude: 14.6015,
      longitude: 120.9832,
      address: 'Barangay Sports Complex',
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

  // Forums state and operations
  forums: Forum[];
  createForum: (input: CreateForumInput) => Forum;
  getForum: (id: string) => Forum | undefined;
  updateForum: (id: string, input: UpdateForumInput) => Forum | null;
  deleteForum: (id: string) => boolean;

  // Projects state (read-only)
  projects: Project[];
  getProject: (id: string) => Project | undefined;
}

const DummyDbContext = createContext<DummyDbContextType | undefined>(undefined);

export const DummyDbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [forums, setForums] = useState<Forum[]>(initialForums);
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

  // Forum CRUD operations
  const createForum = (input: CreateForumInput): Forum => {
    const newForum: Forum = {
      id: `forum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: input.title,
      description: input.description,
      authorName: 'Anonymous User', // Dummy data
      authorId: `user-${Math.floor(Math.random() * 1000)}`, // Dummy data
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setForums((prev) => [newForum, ...prev]);
    return newForum;
  };

  const getForum = (id: string): Forum | undefined => {
    return forums.find((forum) => forum.id === id);
  };

  const updateForum = (id: string, input: UpdateForumInput): Forum | null => {
    let updatedForum: Forum | null = null;

    setForums((prev) =>
      prev.map((forum) => {
        if (forum.id === id) {
          updatedForum = {
            ...forum,
            ...input,
            updatedAt: new Date(),
          };
          return updatedForum;
        }
        return forum;
      })
    );

    return updatedForum;
  };

  const deleteForum = (id: string): boolean => {
    let deleted = false;
    setForums((prev) => {
      const filtered = prev.filter((forum) => forum.id !== id);
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
    forums,
    createForum,
    getForum,
    updateForum,
    deleteForum,
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
