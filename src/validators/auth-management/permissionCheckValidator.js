import { z } from 'zod';

export const checkPermissionSchema = z.object({
  user_id: z.number(),
  permission_name: z.string().min(3),
});
