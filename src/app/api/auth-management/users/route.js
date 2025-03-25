import { NextResponse } from 'next/server';
import * as userService from '@/services/auth-management/userService';
import { createUserSchema } from '@/validators/auth-management/userValidator';
import { ApiError, handleApiError } from '@/utils/errorHandler';
import { withAuth } from '@/middlewares/auth';

export const GET = withAuth(async (req, { user }) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

    let users;

    // ✅ Phân quyền chính xác:
    if (user.role_id === 1) {
      // Admin chỉ lấy Lecturer (2) và Academic Officer (4)
      users = await userService.listUserByRole(user.role_id, user.department_id);
    } else if (user.role_id === 4 || user.role_id === 2) {
      // Academic Officer hoặc Lecturer lọc theo department
      users = await userService.listUserByRole(user.role_id, user.department_id);
    } else {
      throw new ApiError(403, 'Bạn không có quyền xem danh sách người dùng');
    }

    return NextResponse.json(users);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

export const POST = withAuth(async (req) => {
  try {

    const body = await req.json();
    const validated = createUserSchema.parse(body);

    const result = await userService.registerUser(validated);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});