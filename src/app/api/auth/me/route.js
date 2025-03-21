import { NextResponse } from 'next/server';
import * as authService from '@/services/authService';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

// ✅ GET - Lấy profile user từ token
export const GET = withAuth(async (req) => {
  try {
    const user = await authService.getMe(req.user.id);
    return NextResponse.json(user);
  } catch (err) {
    const { status, body } = handleApiError(err, 404);
    return NextResponse.json(body, { status });
  }
});
