import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Middleware Auth nâng cấp
 * @param {*} handler - API handler gốc
 * @param {*} allowedRoles - Array role được phép (nếu có)
 */
export const withAuth = (handler, allowedRoles = []) => async (req, context) => {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Gắn user vào req để API dùng
    req.user = decoded;
    
    // ✅ Nếu API có truyền role, check quyền
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden - No Permission' }, { status: 403 });
      
    }

    return await handler(req, context);
  } catch (err) {
    console.error('Auth error:', err.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
};
