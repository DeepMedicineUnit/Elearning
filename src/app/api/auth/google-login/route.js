import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import * as authModel from '@/models/authModel';
import jwt from 'jsonwebtoken';
import { handleApiError } from '@/utils/errorHandler';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET = process.env.JWT_SECRET || 'secret_key';

export const POST = async (req) => {
  try {
    const { id_token } = await req.json();

    // ✅ Verify token từ Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const email = payload.email;
    const full_name = payload.name;
    const avatar_url = payload.picture;

    // ✅ Optional: Check domain Google (nếu muốn)
    if (!email.endsWith('@gmail.com')) {
      throw new Error('Chỉ chấp nhận email @ptcu.edu.vn');
    }

    // ✅ Tìm user trong DB hoặc tạo mới
    let user = await authModel.findUserByEmail(email);
    if (!user) {
      // Tự động tạo user mới với quyền mặc định (role_id = 2 chẳng hạn)
      await authModel.createUser({
        full_name,
        email,
        password: '', // Không cần password
        role_id: 2,
        position: 'thuong',
        department_id: null,
        avatar_url,
      });
      user = await authModel.findUserByEmail(email);
    }

    // ✅ Trả về JWT
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      department_id: user.department_id,
      position: user.position,
    }, SECRET, { expiresIn: '7d' });

    return NextResponse.json({ token });
  } catch (err) {
    const { status, body } = handleApiError(err, 401);
    return NextResponse.json(body, { status });
  }
};
