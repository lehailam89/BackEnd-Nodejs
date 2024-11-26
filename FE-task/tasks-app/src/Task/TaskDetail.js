import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TASKS_API_URL } from '../config.js'; // Import URL API
import './Task.css'; // Import CSS

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="task-detail-container">
      <h2>Chi tiết công việc</h2>
      <p><strong>ID:</strong> {taskDetail._id}</p>
      <p><strong>Title:</strong> {taskDetail.title}</p>
      <p><strong>Status:</strong> {taskDetail.status}</p>
      <p><strong>Content:</strong> {taskDetail.content}</p>
      <p><strong>Start Time:</strong> {new Date(taskDetail.timeStart).toLocaleDateString()}</p>
      <p><strong>End Time:</strong> {new Date(taskDetail.timeFinish).toLocaleDateString()}</p>
      <button onClick={() => navigate('/tasks')}>Đóng</button>
    </div>
  );
};

export default TaskDetail;