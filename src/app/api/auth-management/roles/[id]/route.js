import { NextResponse } from 'next/server';
import * as roleService from '@/services/auth-management/roleService';
import { createRoleSchema } from '@/validators/auth-management/roleValidator';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const GET = withAuth(async (_, { params }) => {
  try {
    const role = await roleService.getRoleDetail(params.id);
    return NextResponse.json(role);
  } catch (err) {
    const { status, body } = handleApiError(err, 404);
    return NextResponse.json(body, { status });
  }
});

export const PUT = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();
    const validated = createRoleSchema.parse(body);

    const result = await roleService.updateRoleInfo(params.id, validated.name);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

export const DELETE = withAuth(async (_, { params }) => {
  try {
    const result = await roleService.removeRole(params.id);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
