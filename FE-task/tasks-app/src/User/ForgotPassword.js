import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { USERS_API_URL } from '../config.js'; // Import URL API
import './ForgotPassword.css'; // Import CSS

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    axios
      .post(`${USERS_API_URL}/password/forgot`, { email })
      .then((response) => {
        if (response.data.code === 200) {
          setNotification('Đã gửi mã OTP qua email');
          setTimeout(() => {
            setNotification('');
            navigate('/users/password/otp', { state: { email } }); // Điều hướng đến trang nhập OTP
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
    <div className="forgot-password-container">
      <h2>Lấy lại mật khẩu</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleForgotPassword}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Gửi mã OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;