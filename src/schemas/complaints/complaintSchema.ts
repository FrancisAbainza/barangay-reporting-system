import { z } from 'zod';
import { ComplaintCategory } from '../../types/dummyDb';

export const complaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters'),
  category: z.enum([
    'noise',
    'sanitation',
    'public_safety',
    'traffic',
    'infrastructure',
    'water_electricity',
    'domestic',
    'environment',
    'others',
  ], {
    message: 'Please select a valid category',
  }),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }),
  images: z.array(z.object({
    uri: z.string(),
  })).optional(),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
