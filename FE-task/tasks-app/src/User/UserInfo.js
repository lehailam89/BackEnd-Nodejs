import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USERS_API_URL } from '../config.js'; // Import URL API
import './UserInfo.css'; // Import CSS

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(''); // State để lưu thông báo


  useEffect(() => {
    axios
      .get(`${USERS_API_URL}/detail`, { withCredentials: true }) // Gửi yêu cầu với cookie
      .then((response) => {
        if (response.data.code === 200) {
          setUserInfo(response.data.info);
        } else {
          setNotification(response.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setNotification('Đã xảy ra lỗi, vui lòng thử lại sau.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!userInfo) {
    return <div>Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <div className="user-info-container">
      <h2>Thông tin cá nhân</h2>
      {notification && <div className="notification">{notification}</div>}
      <p><strong>Họ và tên:</strong> {userInfo.fullName}</p>
      <p><strong>Email:</strong> {userInfo.email}</p>
      {/* Hiển thị thêm các thông tin khác nếu có */}
    </div>
  );
};

export default UserInfo;