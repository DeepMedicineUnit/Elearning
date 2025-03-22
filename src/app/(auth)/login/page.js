'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Script from 'next/script';
import Link from 'next/link';
import { toast } from 'react-toastify';
import '@ant-design/v5-patch-for-react-19';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại');

            Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
            toast.success('🎉 Đăng nhập thành công');
            setTimeout(() => {
                router.push('/', { shallow: true });
              }, 2000);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Xử lý Google callback
    const handleGoogleCallback = async (response) => {
        try {
            const res = await fetch('/api/auth/google-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_token: response.credential }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Google Login thất bại');

            Cookies.set('token', data.token, { expires: 7, secure: true, sameSite: 'strict' });
            toast.success('🎉 Đăng nhập Google thành công');
            setTimeout(() => {
                router.push('/', { shallow: true });
              }, 2000);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // ✅ Khởi tạo Google SDK
    useEffect(() => {
        const initGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById('google-login-btn'),
                    { theme: 'outline', size: 'large' }
                );
            } else {
                console.error('Google SDK not loaded');
            }
        };

        const timer = setTimeout(initGoogle, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded-lg">
            <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />

            <Typography.Title level={2} className="text-center">Đăng nhập hệ thống</Typography.Title>

            <Form layout="vertical" onFinish={onFinish} initialValues={{ remember: true }} className="mt-6">
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                >
                    <Input placeholder="Nhập email @ptcu.edu.vn" />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                    <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>

                <div className="flex items-center justify-between">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <Link href="/forgot-password">Quên mật khẩu?</Link>
                </div>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>

            <Divider>Hoặc</Divider>

            {/* ✅ Google login button render */}
            <div id="google-login-btn" className="flex justify-center"></div>
        </div>
    );
}
