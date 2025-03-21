import { NextResponse } from 'next/server';
import * as rolePermissionService from '@/services/auth-management/rolePermissionService';
import { assignPermissionSchema } from '@/validators/auth-management/rolePermissionValidator';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

// ✅ POST - Gán permissions vào role
export const POST = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();
    const validated = assignPermissionSchema.parse(body);

    const result = await rolePermissionService.setPermissionsForRole(params.id, validated.permission_ids);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

// ✅ DELETE - Xóa hết permission của role
export const DELETE = withAuth(async (_, { params }) => {
  try {
    const result = await rolePermissionService.clearPermissionsForRole(params.id);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
