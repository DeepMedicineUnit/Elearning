import { NextResponse } from 'next/server';
import * as classService from '@/services/department-class-course/classService';
import { withAuth } from '@/middlewares/auth';
import { handleApiError } from '@/utils/errorHandler';

export const GET = withAuth(async () => {
    try {
        const classes = await classService.listClasses();
        return NextResponse.json(classes);
    } catch (err) {
        const { status, body } = handleApiError(err);
        return NextResponse.json(body, { status });
    }
});

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const result = await classService.createClass(body);
        return NextResponse.json(result);
    } catch (err) {
        const { status, body } = handleApiError(err);
        return NextResponse.json(body, { status });
    }
});
