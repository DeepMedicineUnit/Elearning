import { NextResponse } from 'next/server';
import * as roleService from '@/services/auth-management/roleService';
import { createRoleSchema } from '@/validators/auth-management/roleValidator';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const GET = withAuth(async () => {
  try {
    const roles = await roleService.listRoles();
    return NextResponse.json(roles);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = createRoleSchema.parse(body);

    const result = await roleService.createNewRole(validated.name);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
