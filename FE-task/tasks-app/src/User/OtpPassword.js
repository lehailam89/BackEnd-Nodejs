import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { USERS_API_URL } from '../config.js'; // Import URL API
import './ForgotPassword.css'; // Import CSS

const OtpPassword = () => {
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleOtpPassword = (e) => {
    e.preventDefault();
    axios
      .post(`${USERS_API_URL}/password/otp`, { email, otp })
      .then((response) => {
        if (response.data.code === 200) {
          setNotification('Mã OTP hợp lệ');
          localStorage.setItem('resetToken', response.data.token); // Lưu token vào localStorage
          setTimeout(() => {
            setNotification('');
            navigate('/users/password/reset'); // Điều hướng đến trang đặt lại mật khẩu
          }, 3000); // Ẩn thông báo sau 3 giây
        } else {
          setNotification(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setNotification('Đã xảy ra lỗi, vui lòng thử lại sau.');
      });
  };

  return (
    <div className="otp-password-container">
      <h2>Nhập mã OTP</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleOtpPassword}>
        <div className="form-group">
          <label htmlFor="otp">Mã OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Xác nhận</button>
      </form>
    </div>
  );
};

export default OtpPassword;