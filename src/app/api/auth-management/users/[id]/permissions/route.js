import { NextResponse } from 'next/server';
import * as adminPermissionService from '@/services/auth-management/adminPermissionService';
import { assignAdminPermissionSchema } from '@/validators/auth-management/adminPermissionValidator';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const POST = withAuth(async (req, { params }) => {
  try {
    const body = await req.json();
    const validated = assignAdminPermissionSchema.parse(body);

    // Lấy user được gán từ middleware decode token
    const granted_by = req.user?.id; 

    const result = await adminPermissionService.setPermissionsForUser(params.id, validated.permission_ids, granted_by);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});

// ✅ Xóa hết quyền của user
export const DELETE = withAuth(async (_, { params }) => {
  try {
    const result = await adminPermissionService.clearPermissionsForUser(params.id);
    return NextResponse.json(result);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
});
