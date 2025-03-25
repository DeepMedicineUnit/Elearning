'use client';
import { Modal, Form, Input, Select, Button, Avatar, DatePicker, message } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

/** ✅ Modal Thêm User */
export function AddUserModal({ isOpen, onClose, onFinish, form, currentUser, departments = [], classes = [] }) {
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150');
  const role = Form.useWatch('role', form);

  const getRoleOptions = () => {
    if (!currentUser?.role) return [];
    if (currentUser.role === 'Admin' && currentUser.position === 'provost') {
      return [
        { label: 'Vice (Admin)', value: 'Admin' },
        { label: 'Lecturer', value: 'Lecturer' },
        { label: 'Academic Officer', value: 'Academic Officer' },
      ];
    }
    if (currentUser.role === 'Admin') {
      return [
        { label: 'Lecturer', value: 'Lecturer' },
        { label: 'Academic Officer', value: 'Academic Officer' },
      ];
    }
    if (currentUser.role === 'Academic Officer') {
      return [
        { label: 'Lecturer', value: 'Lecturer' },
        { label: 'Student', value: 'Student' },
      ];
    }
    return [];
  };

  return (
    <Modal
      title="Thêm người dùng"
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Thêm"
      cancelText="Hủy"
      width={650}
    >
      <div className="flex justify-center mb-4">
        <Avatar size={80} src={avatarUrl} />
      </div>

      <Form form={form} layout="vertical" onFinish={(values) => onFinish({ ...values, avatar_url: avatarUrl })}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Họ" name="first_name" rules={[{ required: true, message: 'Nhập họ' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Tên" name="last_name" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Nhập email' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone_number">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="date_of_birth">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select placeholder="Chọn giới tính">
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="other">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: 'Chọn vai trò' }]}>
            <Select options={getRoleOptions()} placeholder="Chọn vai trò" />
          </Form.Item>

          {role !== 'Student' && (
            <Form.Item label="Chức vụ" name="position">
              <Select placeholder="Chọn chức vụ" allowClear>
                <Select.Option value="normal">Normal</Select.Option>
                <Select.Option value="provost">Provost</Select.Option>
                <Select.Option value="vice">Vice</Select.Option>
              </Select>
            </Form.Item>
          )}

          {role && role !== 'Student' && (
            <Form.Item label="Khoa / Phòng ban" name="department_id">
              <Select placeholder="Chọn khoa / phòng ban" allowClear>
                {departments.map((dep) => (
                  <Select.Option key={dep.id} value={dep.id}>{dep.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {role === 'Student' && (
            <Form.Item label="Lớp" name="class_id" rules={[{ required: true, message: 'Chọn lớp' }]}>
              <Select placeholder="Chọn lớp">
                {classes.map((cls) => (
                  <Select.Option key={cls.id} value={cls.id}>{cls.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </div>
      </Form>
    </Modal>
  );
}

/** ✅ Modal Xem / Sửa User */
export function ViewUserModal({ isOpen, onClose, user, onDelete, onEdit, departments = [], classes = [] }) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const role = Form.useWatch('role', form);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        date_of_birth: user.date_of_birth ? dayjs(user.date_of_birth) : null,
      });
      setIsEditing(false);
    }
  }, [user, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onEdit(values);
      setIsEditing(false);
      setConfirmVisible(false);
    } catch (err) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  return (
    <>
      <Modal
        title="Chi tiết người dùng"
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={700}
      >
        {user && (
          <Form form={form} layout="vertical" key={user.id}>
            <div className="flex justify-center mb-6">
              <Avatar size={90} src={user.avatar_url} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Họ và tên" name="full_name">
                <Input disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phone_number">
                <Input disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Ngày sinh" name="date_of_birth">
                <DatePicker className="w-full" format="DD/MM/YYYY" disabled={!isEditing} />
              </Form.Item>

              <Form.Item label="Giới tính" name="gender">
                <Select disabled={!isEditing}>
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                  <Select.Option value="other">Khác</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Vai trò" name="role">
                <Select disabled={!isEditing}>
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Lecturer">Lecturer</Select.Option>
                  <Select.Option value="Academic Officer">Academic Officer</Select.Option>
                  <Select.Option value="Student">Student</Select.Option>
                </Select>
              </Form.Item>

              {role !== 'Student' && (
                <Form.Item label="Chức vụ" name="position">
                  <Select disabled={!isEditing}>
                    <Select.Option value="normal">Normal</Select.Option>
                    <Select.Option value="provost">Provost</Select.Option>
                    <Select.Option value="vice">Vice</Select.Option>
                  </Select>
                </Form.Item>
              )}

              {role && role !== 'Student' && (
                <Form.Item label="Khoa / Phòng ban" name="department_id">
                  <Select disabled={!isEditing}>
                    {departments.map((dep) => (
                      <Select.Option key={dep.id} value={dep.id}>{dep.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              {role === 'Student' && (
                <Form.Item label="Lớp" name="class_id">
                  <Select disabled={!isEditing}>
                    {classes.map((cls) => (
                      <Select.Option key={cls.id} value={cls.id}>{cls.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button danger onClick={onDelete}>Xoá người dùng</Button>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(false)}>Huỷ</Button>
                  <Button type="primary" onClick={() => setConfirmVisible(true)}>Lưu thay đổi</Button>
                </div>
              ) : (
                <Button type="primary" onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              )}
            </div>
          </Form>
        )}
      </Modal>

      {/* Modal xác nhận lưu */}
      <Modal
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onOk={handleSave}
        okText="Xác nhận lưu"
        cancelText="Huỷ"
      >
        <p>Bạn chắc chắn muốn lưu thay đổi?</p>
      </Modal>
    </>
  );
}
