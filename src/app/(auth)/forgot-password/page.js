'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { toast } from 'react-toastify';
import '@ant-design/v5-patch-for-react-19';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gửi email thất bại');

      toast.success('✅ Đã gửi link đặt lại mật khẩu vào email của bạn!');
      // ✅ Chờ 2s cho toast hiện, rồi về login
      setTimeout(() => {
        router.push("/login", { shallow: true });
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded-lg">
      <Typography.Title level={2} className="text-center">Quên mật khẩu</Typography.Title>

      <Form layout="vertical" onFinish={onFinish} className="mt-6">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input placeholder="Nhập email của bạn" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Gửi yêu cầu đặt lại mật khẩu
        </Button>

        {/* ✅ Nút quay về Login */}
        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-500 hover:underline transition duration-300">
            Quay về trang Đăng nhập
          </Link>
        </div>
      </Form>
    </div>
  );
}
