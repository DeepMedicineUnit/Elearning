import { NextResponse } from 'next/server';
import * as permissionService from '@/services/auth-management/permissionService';
import { createPermissionSchema } from '@/validators/auth-management/permissionValidator';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const GET = withAuth(async (_, { params }) => {
  try {
    const permission = await permissionService.getPermissionDetail(params.id);
    return NextResponse.json(permission);
  } catch (err) {
    const { status, body } = handleApiError(err, 404);
    return NextResponse.json(body, { status });
  }
});

export const PUT = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();
    const validated = createPermissionSchema.parse(body);

    const result = await permissionService.updatePermissionInfo(params.id, validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

export const DELETE = withAuth(async (_, { params }) => {
  try {
    const result = await permissionService.removePermission(params.id);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
