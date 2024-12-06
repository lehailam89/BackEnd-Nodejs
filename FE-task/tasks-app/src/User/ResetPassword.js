import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { USERS_API_URL } from '../config.js'; // Import URL API
import './ForgotPassword.css'; // Import CSS

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const navigate = useNavigate();
  const token = localStorage.getItem('resetToken'); // Lấy token từ localStorage

  const handleResetPassword = (e) => {
    e.preventDefault();
    axios
      .post(`${USERS_API_URL}/password/reset`, { token, password })
      .then((response) => { 
        if (response.data.code === 200) {
          setNotification('Đổi mật khẩu thành công!');
          setTimeout(() => {
            setNotification('');
            navigate('/users/login'); // Điều hướng đến trang đăng nhập
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
    <div className="reset-password-container">
      <h2>Đổi mật khẩu</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu mới</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đổi mật khẩu</button>
      </form>
    </div>
  );
};

export default ResetPassword;