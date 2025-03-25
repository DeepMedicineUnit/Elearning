import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authModel from '@/models/authModel';
import { sendResetPasswordEmail } from '@/lib/mail';
import { v4 as uuidv4 } from 'uuid';

const SECRET = process.env.JWT_SECRET || 'secret_key';

export const register = async (data) => {
    const existing = await authModel.findUserByEmail(data.email);
    if (existing) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await authModel.createUser({ ...data, password: hashedPassword });
    return { message: 'User registered successfully' };
};

export const login = async (email, password) => {
    const user = await authModel.findUserByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign({
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        department_id: user.department_id,
        position: user.position,
    }, SECRET, { expiresIn: '7d' });

    return { token };
};

export const getMe = async (user_id) => {
    const user = await authModel.getUserById(user_id);
    if (!user) throw new Error('User not found');
    return user;
};

export const forgotPassword = async (email) => {
    const user = await authModel.findUserByEmail(email);
    if (!user) throw new Error('Email not found');

    const token = await authModel.createResetToken(user.id);
    // TODO: gửi mail chứa link reset: /reset-password?token=${token}
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await sendResetPasswordEmail(email, resetLink);

    return { message: 'Reset password link sent (check console)' };
};

export const processResetPassword = async (token, new_password) => {
    const resetData = await authModel.findResetToken(token);
    if (!resetData) throw new Error('Invalid or expired token');

    const hashed = await bcrypt.hash(new_password, 10);
    await authModel.resetPassword(resetData.user_id, hashed);
    await authModel.deleteResetToken(token);

    return { message: 'Password reset successfully' };
};