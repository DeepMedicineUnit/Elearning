import { NextResponse } from 'next/server';
import * as authService from '@/services/authService';
import { loginSchema } from '@/validators/authValidator';
import { handleApiError } from '@/utils/errorHandler';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);

    const result = await authService.login(validated.email, validated.password);
    return NextResponse.json(result); // { token: '...' }
  } catch (err) {
    const { status, body } = handleApiError(err, 401);
    return NextResponse.json(body, { status });
  }
};
