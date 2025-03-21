import { NextResponse } from 'next/server';
import * as permissionService from '@/services/auth-management/permissionService';
import { createPermissionSchema } from '@/validators/auth-management/permissionValidator';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const GET = withAuth(async () => {
  try {
    const permissions = await permissionService.listPermissions();
    return NextResponse.json(permissions);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = createPermissionSchema.parse(body);

    const result = await permissionService.createNewPermission(validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
