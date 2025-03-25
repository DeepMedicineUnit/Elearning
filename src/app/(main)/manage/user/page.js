'use client';
import { useEffect, useState } from 'react';
import { Typography, Input, Button, Form } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { toast } from 'react-toastify';
import UserFilter from '@/components/manage/users/UserFilter';
import UserTable from '@/components/manage/users/UserTable';
import { AddUserModal, ViewUserModal } from '@/components/manage/users/UserModal';

export default function ManageUserPage() {
    const [users, setUsers] = useState([]);
    const [roleId, setRoleId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterRoles, setFilterRoles] = useState([]);
    const [filterPositions, setFilterPositions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = jwt.decode(token);
            const roleMapping = {
                1: 'Admin',
                2: 'Lecturer',
                3: 'Student',
                4: 'Academic Officer',
            };

            setRoleId(decoded?.role_id);
            setCurrentUser({
                ...decoded,
                role: roleMapping[decoded?.role_id] || null,  // ✅ Bổ sung role string cho modal
            });

            fetchUsers();
            fetchDepartments();
            fetchClasses();
        }
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth-management/users?page=1&limit=20', {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            const data = await res.json();
            const list = data?.map((item, index) => ({
                ...item,
                key: item.id,
                stt: index + 1,
                role: item.role_name,
                class: item.class_name || 'Y đa khoa',
            }));
            setUsers(list);
        } catch (err) {
            console.error('Fetch user error:', err);
            toast.error('❌ Lỗi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await fetch('/api/department-class-course/departments', {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            const data = await res.json();
            setDepartments(data);
        } catch (err) {
            console.error('Fetch departments error:', err);
            toast.error('❌ Lỗi tải danh sách khoa');
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await fetch('/api/department-class-course/classes', {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            const data = await res.json();
            setClasses(data);
        } catch (err) {
            console.error('Fetch classes error:', err);
            toast.error('❌ Lỗi tải danh sách lớp');
        }
    };

    const resetFilters = () => {
        setFilterRoles([]);
        setFilterPositions([]);
    };

    const filteredUsers = users.filter(user => {
        const roleMatch = filterRoles.length ? filterRoles.includes(user.role) : true;
        const positionMatch = filterPositions.length ? filterPositions.includes(user.position) : true;
        const searchMatch = user.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase());
        return roleMatch && positionMatch && searchMatch;
    });

    const handleTableChange = (paginationInfo) => setPagination(paginationInfo);

    const roleMap = {
        'Admin': 1,
        'Lecturer': 2,
        'Student': 3,
        'Academic Officer': 4,
    };

    const handleCreateUser = async (values) => {
        try {
            const randomPassword = Math.random().toString(36).slice(-8);
            const dateOfBirth = values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null;

            const payload = {
                full_name: `${values.first_name} ${values.last_name}`,
                email: values.email,
                password: randomPassword,
                role_id: roleMap[values.role],  // ✅ Convert role string sang role_id
                position: values.role !== 'Student' ? (values.position || 'normal') : null,
                department_id: values.role !== 'Student' ? Number(values.department_id) || null : null,
                class_id: values.role === 'Student' ? Number(values.class_id) : null,
                avatar_url: 'https://i.pravatar.cc/150',
                phone_number: values.phone_number || null,
                gender: values.gender || null,
                date_of_birth: dateOfBirth,
            };

            console.log('✅ Payload gửi:', payload);

            const res = await fetch('/api/auth-management/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Tạo người dùng thất bại');
            toast.success('✅ Thêm người dùng thành công');
            setIsModalOpen(false);
            form.resetFields();
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error('❌ Lỗi tạo user!');
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`/api/auth-management/users/${selectedUser.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            if (!res.ok) throw new Error('Xoá thất bại');
            toast.success('✅ Xoá người dùng thành công');
            setIsViewModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error('❌ Xoá thất bại');
        }
    };

    const handleEditUser = async (values) => {
        try {
            const dateOfBirth = values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null;

            const payload = {
                full_name: values.full_name,
                email: values.email,
                position: values.position,
                role_id: roleMap[values.role] || selectedUser.role_id, // ✅ Convert role string sang role_id
                department_id: values.department_id ?? selectedUser.department_id ?? null,
                class_id: values.class_id ?? selectedUser.class_id ?? null,
                avatar_url: selectedUser.avatar_url ?? 'https://i.pravatar.cc/150',
                phone_number: values.phone_number?.trim() || null,
                gender: values.gender?.trim() || null,
                date_of_birth: dateOfBirth,
            };

            console.log('✅ Payload sửa:', payload);

            const res = await fetch(`/api/auth-management/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Sửa thất bại');
            toast.success('✅ Cập nhật thành công');
            setIsViewModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error(err);
            toast.error('❌ Sửa thất bại');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Typography.Title level={3} className="m-0">Quản lý users</Typography.Title>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>+ Thêm mới</Button>
            </div>

            <div className="w-full h-[2px] bg-gray-300 my-4"></div>

            <div className="flex items-center justify-between mb-4">
                <UserFilter
                    filterRoles={filterRoles}
                    setFilterRoles={setFilterRoles}
                    filterPositions={filterPositions}
                    setFilterPositions={setFilterPositions}
                    roleId={roleId}
                    resetFilters={resetFilters}
                />

                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Nhập tên hoặc email..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchUsers} />
                </div>
            </div>

            <UserTable
                roleId={roleId}
                data={filteredUsers}
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                handleViewUser={handleViewUser}
            />

            <AddUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onFinish={handleCreateUser}
                form={form}
                currentUser={currentUser}
                departments={departments}
                classes={classes}
            />

            <ViewUserModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                user={selectedUser}
                onDelete={handleDeleteUser}
                onEdit={handleEditUser}
                departments={departments}
                classes={classes}
            />
        </div>
    );
}
