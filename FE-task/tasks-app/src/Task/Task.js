import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskDetail from './TaskDetail'; // Import component TaskDetail
import './Task.css'; // Tạo file CSS riêng nếu cần
import { TASKS_API_URL} from '../config.js'; // Import URL API

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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

  if (selectedTaskId) {
    return <TaskDetail taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />;
  }

  return (
    <div className="tasks-container">
      <h1>Danh sách công việc</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={`task-item ${task.status}`}>
            <h2>{task.title}</h2>
            <button onClick={() => setSelectedTaskId(task._id)}>Xem chi tiết</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;