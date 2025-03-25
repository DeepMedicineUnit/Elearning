import { z } from 'zod';

export const createUserSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role_id: z.number(),
  position: z.enum(['normal', 'provost', 'vice']),
  department_id: z.number().nullable(),
  avatar_url: z.string().url().optional(),
  phone_number: z.string().nullable(),
  gender: z.enum(['male', 'female', 'other']).nullable(),
  date_of_birth: z.string().nullable(), // Có thể format 'YYYY-MM-DD'
});
