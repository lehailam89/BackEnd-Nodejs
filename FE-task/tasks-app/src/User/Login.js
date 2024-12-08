import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config.js'; // Import URL API
import './Login.css'; // Import CSS

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  }); // State để lưu thông tin người dùng
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/users/login`, user, { withCredentials: true })
      .then((response) => {
        if (response.data.code === 200) {
          setNotification('Đăng nhập thành công!');
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Lưu thông tin người dùng vào localStorage
          } else {
            console.error("Thông tin người dùng không tồn tại trong phản hồi API.");
          }
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
    <div className="login-container">
      <h2>Đăng nhập tài khoản</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            autoComplete="current-email"
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <p className="register-link">
        Bạn chưa có tài khoản?
        <span 
        className="register-hover" 
        onClick={() => navigate('/users/register')}
            >
            Đăng ký
        </span>
      </p>
    </div>
  );
};

export default Login;