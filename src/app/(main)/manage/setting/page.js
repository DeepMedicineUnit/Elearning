'use client';
import { Typography } from 'antd';
import '@ant-design/v5-patch-for-react-19';

export default function ManageSettingPage() {
  return (
    <div>
      <Typography.Title level={3}>Setting</Typography.Title>
      {/* Có thể render luôn dashboard chart, stats ở đây */}
    </div>
  );
}
