import { NextResponse } from 'next/server';
import * as userService from '@/services/auth-management/userService';
import { ApiError, handleApiError } from '@/utils/errorHandler';
import { withAuth } from '@/middlewares/auth';
import { createUserSchema } from '@/validators/auth-management/userValidator';

// ✅ GET /users/:id - Lấy user chi tiết
export const GET = withAuth(async (_, { params }) => {
  try {
    const user = await userService.getUserDetail(params.id);
    return NextResponse.json(user);
  } catch (err) {
    const { status, body } = handleApiError(err, 404);
    return NextResponse.json(body, { status });
  }
});

// ✅ PUT /users/:id - Cập nhật user
export const PUT = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();

    // Validate dữ liệu update (có thể custom schema update riêng)
    const validated = createUserSchema.partial().parse(body);

    const result = await userService.updateUserInfo(params.id, validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

// ✅ DELETE /users/:id - Xóa user
export const DELETE = withAuth(async (_, { params }) => {
  try {
    const result = await userService.removeUser(params.id);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
