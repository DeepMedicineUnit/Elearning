'use client';

import Link from 'next/link';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  ApartmentOutlined,
  MessageOutlined,
  SettingOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

export default function ManageSidebar() {
  const router = useRouter();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/manage">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link href="/manage/user">Người dùng</Link>,
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: <Link href="/manage/course">Khoá học</Link>,
    },
    {
      key: 'departments',
      icon: <ApartmentOutlined />,
      label: <Link href="/manage/department">Khoa - Phòng ban</Link>,
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: <Link href="/manage/message">Tin nhắn</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link href="/manage/setting">Cài đặt</Link>,
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* ✅ Khu vực Logo */}
      <div className="p-4 text-lg font-bold text-center">
        Quản lý hệ thống
      </div>

      {/* ✅ Menu chiếm hết phần còn lại */}
      <div className="flex-1 overflow-auto mt-15">
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          className="border-none"
          items={menuItems}
        />
      </div>

      {/* ✅ Nút về trang chủ */}
      <div className="p-4">
        <Button
          type="primary"
          icon={<RollbackOutlined />}
          block
          onClick={() => router.push('/')}
        >
          Về Trang chủ
        </Button>
      </div>
    </div>
  );
}
