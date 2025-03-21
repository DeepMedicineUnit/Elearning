import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const withAuth = (handler) => async (req, context) => {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Unauthorized');

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        return await handler(req, context);
    } catch (err) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
};
