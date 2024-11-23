import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Task.css'; // Tạo file CSS riêng nếu cần
import { TASKS_API_URL } from '../config.js'; // Import URL API

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy dữ liệu
    axios
      .get(TASKS_API_URL)
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="tasks-container">
      <h1>Danh sách công việc</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={`task-item ${task.status}`}>
            <h2>{task.title}</h2>
            <button onClick={() => navigate(`/tasks/${task._id}`)}>Xem chi tiết</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;