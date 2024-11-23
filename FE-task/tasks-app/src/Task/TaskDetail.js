import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskDetail = ({ taskId, onClose }) => {
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/tasks/detail/${taskId}`)
      .then((response) => {
        setTaskDetail(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API chi tiết công việc:", error);
        setLoading(false);
      });
  }, [taskId]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!taskDetail) {
    return <div>Không tìm thấy công việc</div>;
  }

  return (
    <div className="task-detail">
      <h2>Chi tiết công việc</h2>
      <p>ID: {taskDetail._id}</p>
      <p>Title: {taskDetail.title}</p>
      <p>Status: {taskDetail.status}</p>
      <p>Content: {taskDetail.content}</p>
      <p>Start Time: {new Date(taskDetail.timeStart).toLocaleDateString()}</p>
      <p>End Time: {new Date(taskDetail.timeFinish).toLocaleDateString()}</p>
      <button onClick={onClose}>Đóng</button>
    </div>
  );
};

export default TaskDetail;