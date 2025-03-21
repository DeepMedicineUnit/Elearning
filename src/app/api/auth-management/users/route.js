import { NextResponse } from 'next/server';
import * as userService from '@/services/auth-management/userService';
import { createUserSchema } from '@/validators/auth-management/userValidator';
import { ApiError, handleApiError } from '@/utils/errorHandler';
import { withAuth } from '@/middlewares/auth';

export const GET = withAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  try {
    const users = await userService.listUsers(page, limit);
    return NextResponse.json(users);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();

    // Validate input
    const validated = createUserSchema.parse(body);

    const result = await userService.registerUser(validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
