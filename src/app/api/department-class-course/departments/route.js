import { NextResponse } from 'next/server';
import * as departmentService from '@/services/department-class-course/departmentService';
import { handleApiError } from '@/utils/errorHandler';

// ✅ GET /api/department - Lấy danh sách department
export const GET = async () => {
  try {
    const departments = await departmentService.listDepartments();
    return NextResponse.json(departments);
  } catch (err) {
    const { status, body } = handleApiError(err);
    return NextResponse.json(body, { status });
  }
};
