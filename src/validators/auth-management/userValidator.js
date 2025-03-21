import { z } from 'zod';

export const createUserSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role_id: z.number(),
  position: z.enum(['thuong', 'truong', 'pho']),
  department_id: z.number().optional(),
  avatar_url: z.string().url().optional(),
});
