'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Form, Input, Button, Typography } from 'antd';
import { toast } from 'react-toastify';
import '@ant-design/v5-patch-for-react-19';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const onFinish = async (values) => {
    if (!token) return toast.error('Token không hợp lệ hoặc đã hết hạn!');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          new_password: values.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Đổi mật khẩu thất bại');

      toast.success('✅ Đổi mật khẩu thành công!');
      // ✅ Delay 2s rồi về login cho toast hiện mượt
      setTimeout(() => {
        router.push('/login', { shallow: true });
      }, 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow rounded-lg">
      <Typography.Title level={2} className="text-center">Đặt lại mật khẩu</Typography.Title>

      <Form layout="vertical" onFinish={onFinish} className="mt-6">
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Đổi mật khẩu
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
