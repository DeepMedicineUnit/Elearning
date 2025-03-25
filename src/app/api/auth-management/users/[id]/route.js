import { NextResponse } from 'next/server';
import * as userService from '@/services/auth-management/userService';
import { ApiError, handleApiError } from '@/utils/errorHandler';
import { withAuth } from '@/middlewares/auth';
import { createUserSchema } from '@/validators/auth-management/userValidator';

// ✅ GET /users/:id - Lấy user chi tiết
export const GET = withAuth(async (req, context) => {
  try {
    const { id } = await context.params; // ✅ Bắt buộc await
    const targetUser = await userService.getUserDetail(id);
    if (!targetUser) throw new ApiError(404, 'User không tồn tại');

    // ✅ Phân quyền xem chi tiết
    if (req.user.role_id !== 1) { // Không phải Admin
      if (targetUser.role_id === 1) throw new ApiError(403, 'Không có quyền xem Admin');
      if ([2, 4].includes(req.user.role_id) && targetUser.department_id !== req.user.department_id) {
        throw new ApiError(403, 'Không có quyền xem user ngoài khoa');
      }
    }

    return NextResponse.json(targetUser);
  } catch (err) {
    const { status, body } = handleApiError(err, 404);
    return NextResponse.json(body, { status });
  }
});

// ✅ PUT /users/:id - Cập nhật user
export const PUT = withAuth(async (req, context) => {
  try {
    const { id } = await context.params;  // ✅ BẮT BUỘC await đúng theo Next.js
    const userId = Number(id);
    if (!userId) throw new ApiError(400, 'Invalid user ID');

    const body = await req.json();
    const validated = createUserSchema.partial().parse(body);

    const result = await userService.updateUserInfo(userId, validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

export const DELETE = withAuth(async (req, context) => {
  try {
    const { id } = await context.params;  // ✅ BẮT BUỘC await
    const userId = Number(id);
    if (!userId) throw new ApiError(400, 'Invalid user ID');

    const result = await userService.removeUser(userId);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

