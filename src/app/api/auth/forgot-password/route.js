import { NextResponse } from 'next/server';
import * as authService from '@/services/authService';
import { forgotSchema } from '@/validators/authValidator';
import { handleApiError } from '@/utils/errorHandler';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const validated = forgotSchema.parse(body);

    const result = await authService.forgotPassword(validated.email);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err, 404);
    return NextResponse.json(body, { status });
  }
};
