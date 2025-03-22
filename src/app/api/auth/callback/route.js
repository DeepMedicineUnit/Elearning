import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

    // ✅ Đổi code lấy access_token + id_token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.id_token) return NextResponse.json({ error: 'Failed to get ID Token' }, { status: 400 });

    // ✅ Giải mã id_token lấy thông tin user
    const userInfo = JSON.parse(Buffer.from(tokenData.id_token.split('.')[1], 'base64').toString());

    // ✅ Check domain @ptcu.edu.vn (nếu muốn)
    if (!userInfo.email.endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Chỉ chấp nhận email @ptcu.edu.vn' }, { status: 403 });
    }

    // ✅ Gen JWT hệ thống
    const yourJwt = jwt.sign(
      { email: userInfo.email, name: userInfo.name, picture: userInfo.picture },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Set token vào cookie rồi redirect về dashboard
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`);
    response.cookies.set('token', yourJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('OAuth Error:', err);
    return NextResponse.json({ error: 'OAuth error' }, { status: 500 });
  }
};
