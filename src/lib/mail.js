import nodemailer from 'nodemailer';

// Hàm gửi mail reset password
export const sendResetPasswordEmail = async (to, resetLink) => {
  // Config SMTP (dùng Gmail hoặc SMTP bất kỳ)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true nếu dùng port 465
    auth: {
      user: process.env.SMTP_USER, // Email gửi
      pass: process.env.SMTP_PASS, // App Password Gmail
    },
  });

  // Soạn nội dung email
  const mailOptions = {
    from: `"Phan Chau Trinh Medical University" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset Password - Phan Chau Trinh',
    html: `
      <p>Xin chào,</p>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu. Click vào link dưới để thực hiện:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Trân trọng,</p>
      <p>Phan Chau Trinh Medical University</p>
    `,
  };

  // Gửi email
  await transporter.sendMail(mailOptions);
};
