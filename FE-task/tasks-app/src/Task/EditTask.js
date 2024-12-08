import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TASKS_API_URL, USERS_API_URL } from '../config.js'; // Import URL API
import './EditTask.css'; // Import CSS

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    content: '',
    status: 'initial',
    timeStart: '',
    timeFinish: '',
    listUser: []
  }); // State để lưu thông tin công việc
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng

  useEffect(() => {
    axios
      .get(`${TASKS_API_URL}/detail/${id}`)
      .then((response) => {
        const taskData = response.data;
        // Định dạng lại thời gian để phù hợp với input loại datetime-local
        taskData.timeStart = new Date(taskData.timeStart).toISOString().slice(0, 16);
        taskData.timeFinish = new Date(taskData.timeFinish).toISOString().slice(0, 16);
        setTask(taskData);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API chi tiết công việc:", error);
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

  const handleEditTask = (e) => {
    e.preventDefault();
    axios
      .patch(`${TASKS_API_URL}/edit/${id}`, task)
      .then((response) => {
        if (response.data.code === 200) {
          setNotification('Cập nhật nhiệm vụ thành công!');
          setTimeout(() => {
            setNotification('');
            navigate('/tasks'); // Điều hướng về trang danh sách công việc
          }, 3000); // Ẩn thông báo sau 3 giây
        } else {
          console.error("Lỗi khi cập nhật nhiệm vụ:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleUserChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTask((prevTask) => ({
        ...prevTask,
        listUser: [...prevTask.listUser, value]
      }));
    } else {
      setTask((prevTask) => ({
        ...prevTask,
        listUser: prevTask.listUser.filter((userId) => userId !== value)
      }));
    }
  };

  return (
    <div className="edit-task-container">
      <h2>Chỉnh sửa công việc</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleEditTask}>
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Nội dung</label>
          <textarea
            id="content"
            value={task.content}
            onChange={(e) => setTask({ ...task, content: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            <option value="initial">Initial</option>
            <option value="doing">Doing</option>
            <option value="finish">Finish</option>
            <option value="pending">Pending</option>
            <option value="notFinish">Not Finish</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="timeStart">Thời gian bắt đầu</label>
          <input
            type="datetime-local"
            id="timeStart"
            value={task.timeStart}
            onChange={(e) => setTask({ ...task, timeStart: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeFinish">Thời gian kết thúc</label>
          <input
            type="datetime-local"
            id="timeFinish"
            value={task.timeFinish}
            onChange={(e) => setTask({ ...task, timeFinish: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Người tham gia</label>
          <div className="participants-container">
            {users.map((user) => (
              <div key={user._id} className="participant-item">
                <input
                  type="checkbox"
                  id={user._id}
                  value={user._id}
                  checked={task.listUser.includes(user._id)}
                  onChange={handleUserChange}
                />
                <label htmlFor={user._id}>{user.fullName} ({user.email})</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Cập nhật công việc</button>
      </form>
    </div>
  );
};

export default EditTask;