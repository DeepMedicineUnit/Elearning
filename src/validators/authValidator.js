import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role_id: z.number(),
  position: z.enum(['thuong', 'truong', 'pho']),
  department_id: z.number().optional(),
  avatar_url: z.string().url().optional(),
});

export const loginSchema = z.object({
  email: z.string().email().refine((email) => email.endsWith('@gmail.com'), {
    message: 'Chỉ chấp nhận email @ptcu.edu.vn',
  }),
  password: z.string().min(6),
});

export const forgotSchema = z.object({ email: z.string().email() });
export const resetPasswordSchema = z.object({
  token: z.string(),
  new_password: z.string().min(6),
});