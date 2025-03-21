import { NextResponse } from 'next/server';
import * as authService from '@/services/authService';
import { resetPasswordSchema } from '@/validators/authValidator';
import { handleApiError } from '@/utils/errorHandler';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const validated = resetPasswordSchema.parse(body);

    const result = await authService.processResetPassword(validated.token, validated.new_password);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err, 400);
    return NextResponse.json(body, { status });
  }
};
