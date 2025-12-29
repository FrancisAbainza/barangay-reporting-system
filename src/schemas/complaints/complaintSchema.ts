import { z } from 'zod';

export const complaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must not exceed 500 characters'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().min(1, 'Address is required'),
  }, {
    message: 'Please select a location for the complaint',
  }),
  images: z.array(z.object({
    uri: z.string(),
  })).optional(),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
