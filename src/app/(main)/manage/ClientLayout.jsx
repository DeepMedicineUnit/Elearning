'use client';

import { Layout } from 'antd';
import ManageSidebar from '@/components/manage/ManageSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@ant-design/v5-patch-for-react-19';

const { Sider, Content } = Layout;

export default function ClientLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} className="bg-white shadow">
        <ManageSidebar />
      </Sider>

      <Layout>
        <Content className="p-6 bg-gray-50 min-h-screen">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
