import { z } from 'zod';

export const assignAdminPermissionSchema = z.object({
  permission_ids: z.array(z.number()).min(1, 'At least one permission ID is required'),
});
