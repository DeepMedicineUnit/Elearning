import { NextResponse } from 'next/server';
import * as classService from '@/services/department-class-course/classService';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const GET = withAuth(async (_, context) => {
    try {
        const classItem = await classService.getClassDetail(context.params.id);
        return NextResponse.json(classItem);
    } catch (err) {
        const { status, body } = handleApiError(err, 404);
        return NextResponse.json(body, { status });
    }
});

export const PUT = withAuth(async (req, context) => {
    try {
        const body = await req.json();
        const result = await classService.updateClass(context.params.id, body);
        return NextResponse.json(result);
    } catch (err) {
        const { status, body } = handleApiError(err);
        return NextResponse.json(body, { status });
    }
});

export const DELETE = withAuth(async (_, context) => {
    try {
        const result = await classService.removeClass(context.params.id);
        return NextResponse.json(result);
    } catch (err) {
        const { status, body } = handleApiError(err);
        return NextResponse.json(body, { status });
    }
});
