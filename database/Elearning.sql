-- ========================================
-- 1️⃣ TẠO BẢNG NGƯỜI DÙNG & PHÂN QUYỀN
-- ========================================
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) NULL, -- Ảnh đại diện
    role_id INT NOT NULL,
    position NVARCHAR(20) CHECK (position IN ('normal', 'provost', 'vice')),
    department_id INT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
	phone_number VARCHAR(20),
	gender VARCHAR(10),
    date_of_birth DATE,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE permissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) UNIQUE NOT NULL,
    description NVARCHAR(MAX),
	position NVARCHAR(20) NULL CHECK (position IS NULL OR position IN ('normal', 'provost', 'vice'))
);

CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE admin_permissions (
    admin_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_by INT NOT NULL,
    PRIMARY KEY (admin_id, permission_id),
    FOREIGN KEY (admin_id) REFERENCES users(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    FOREIGN KEY (granted_by) REFERENCES users(id)
);

-- ========================================
-- 2️⃣ TẠO BẢNG KHOA - LỚP - MÔN HỌC
-- ========================================
CREATE TABLE departments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) UNIQUE NOT NULL,
    description NVARCHAR(MAX)
);

CREATE TABLE classes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) UNIQUE NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE students_classes (
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    joined_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (student_id, class_id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE courses (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) UNIQUE NOT NULL,
    description NVARCHAR(MAX),
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE course_classes (
    course_id INT NOT NULL,
    class_id INT NOT NULL,
    assigned_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (course_id, class_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- ========================================
-- 3️⃣ TẠO BẢNG CHỦ ĐỀ - BÀI GIẢNG - HỌC LIỆU
-- ========================================
CREATE TABLE topics (
    id INT IDENTITY(1,1) PRIMARY KEY,
    course_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE lessons (
    id INT IDENTITY(1,1) PRIMARY KEY,
    topic_id INT NOT NULL, -- Chỉ liên kết với topic
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX),
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE lesson_materials (
    id INT IDENTITY(1,1) PRIMARY KEY,
    lesson_id INT NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- ========================================
-- 4️⃣ TẠO BẢNG QUIZ & KẾT QUẢ QUIZ
-- ========================================
CREATE TABLE quizzes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    topic_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE quiz_questions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT NOT NULL,
    question NVARCHAR(MAX) NOT NULL,
    options NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE quiz_results (
    id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT NOT NULL,
    student_id INT NOT NULL,
    score FLOAT NOT NULL,
    submitted_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

-- ========================================
-- 5️⃣ TẠO BẢNG GIAO TIẾP & THÔNG BÁO
-- ========================================
CREATE TABLE messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NULL,
    class_id INT NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE notifications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reports (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    report_type NVARCHAR(255) NOT NULL,
    details NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) CHECK (status IN ('pending', 'resolved')),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ========================================
-- 6️⃣ TẠO BẢNG NHẬT KÝ HOẠT ĐỘNG & CẤU HÌNH
-- ========================================
CREATE TABLE activity_logs (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    action NVARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE settings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    key_name NVARCHAR(255) UNIQUE NOT NULL,
    value NVARCHAR(MAX) NOT NULL
);

-- ========================================
-- 7️⃣ TỐI ƯU CHỈ MỤC (INDEX) ĐỂ TRUY VẤN NHANH HƠN
-- ========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_quiz_results ON quiz_results(student_id, quiz_id);

CREATE TABLE password_resets (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
