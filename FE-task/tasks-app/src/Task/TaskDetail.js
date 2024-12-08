import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TASKS_API_URL, USERS_API_URL } from '../config.js'; // Import URL API
import './Task.css'; // Import CSS

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng

  useEffect(() => {
    axios
      .get(`${TASKS_API_URL}/detail/${id}`)
      .then((response) => {
        setTaskDetail(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API chi tiết công việc:", error);
        setLoading(false);
      });

    // Lấy danh sách người dùng từ backend
    axios
      .get(`${USERS_API_URL}/list`, { withCredentials: true })
      .then((response) => {
        if (response.data.code === 200) {
          setUsers(response.data.users);
        } else {
          console.error("Lỗi khi lấy danh sách người dùng:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!taskDetail) {
    return <div>Không tìm thấy công việc</div>;
  }

  const participants = users.filter((user) => taskDetail.listUser.includes(user._id));

  return (
    <div className="task-detail-container">
      <h2>Chi tiết công việc</h2>
      <p><strong>ID:</strong> {taskDetail._id}</p>
      <p><strong>Title:</strong> {taskDetail.title}</p>
      <p><strong>Status:</strong> {taskDetail.status}</p>
      <p><strong>Content:</strong> {taskDetail.content}</p>
      <p><strong>Start Time:</strong> {new Date(taskDetail.timeStart).toLocaleDateString()}</p>
      <p><strong>End Time:</strong> {new Date(taskDetail.timeFinish).toLocaleDateString()}</p>
      <p><strong>Người tham gia:</strong></p>
      <ul>
        {participants.map((user) => (
          <li key={user._id}>{user.fullName} ({user.email})</li>
        ))}
      </ul>
      <button onClick={() => navigate('/tasks')}>Đóng</button>
    </div>
  );
};

export default TaskDetail;