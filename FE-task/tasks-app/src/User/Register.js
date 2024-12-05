import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config.js'; // Import URL API
import './Register.css'; // Import CSS

const Register = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: ''
  }); // State để lưu thông tin người dùng
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/users/register`, user)
      .then((response) => {
        if (response.data.code === 200) {
          setNotification('Đăng ký thành công!');
          setTimeout(() => {
            setNotification('');
            navigate('/tasks'); // Điều hướng về trang danh sách công việc
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
    <div className="register-container">
      <h2>Đăng ký tài khoản</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            type="text"
            id="fullName"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

export default Register;