import { NextResponse } from 'next/server';
import * as permissionCheckService from '@/services/auth-management/permissionCheckService';
import { checkPermissionSchema } from '@/validators/auth-management/permissionCheckValidator';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = checkPermissionSchema.parse(body);

    const result = await permissionCheckService.checkPermission(validated.user_id, validated.permission_name);
    return NextResponse.json(result); // { hasPermission: true }
  } catch (err) {
    const { status, body } = handleApiError(err, 403);
    return NextResponse.json(body, { status });
  }
});
