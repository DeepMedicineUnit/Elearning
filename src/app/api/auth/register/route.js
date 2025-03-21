import { NextResponse } from 'next/server';
import * as authService from '@/services/authService';
import { registerSchema } from '@/validators/authValidator';
import { handleApiError } from '@/utils/errorHandler';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const result = await authService.register(validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
};
