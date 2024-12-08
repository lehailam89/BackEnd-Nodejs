import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TASKS_API_URL, USERS_API_URL } from '../config.js'; // Import URL API
import './CreateTask.css'; // Import CSS

const CreateTask = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    content: '',
    status: 'initial',
    timeStart: '',
    timeFinish: '',
    listUser: []
  }); // State để lưu thông tin công việc mới
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const [users, setUsers] = useState([]); // State để lưu danh sách người dùng
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleCreateTask = (e) => {
    e.preventDefault();
    axios
      .post(`${TASKS_API_URL}/create`, newTask, { withCredentials: true }) // Gửi yêu cầu với cookie
      .then((response) => {
        if (response.data.code === 200) {
          setNotification('Tạo nhiệm vụ mới thành công!');
          localStorage.setItem('notification', 'Tạo nhiệm vụ mới thành công!'); // Lưu thông báo vào localStorage
          setTimeout(() => {
            setNotification('');
            navigate('/tasks'); // Điều hướng về trang danh sách công việc
          }, 3000); // Ẩn thông báo sau 3 giây
        } else {
          console.error("Lỗi khi tạo nhiệm vụ mới:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleUserChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewTask((prevTask) => ({
        ...prevTask,
        listUser: [...prevTask.listUser, value]
      }));
    } else {
      setNewTask((prevTask) => ({
        ...prevTask,
        listUser: prevTask.listUser.filter((userId) => userId !== value)
      }));
    }
  };

  return (
    <div className="create-task-container">
      <h2>Tạo công việc mới</h2>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={handleCreateTask}>
        <div className="form-group">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Nội dung</label>
          <textarea
            id="content"
            value={newTask.content}
            onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Trạng thái</label>
          <select
            id="status"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
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
            value={newTask.timeStart}
            onChange={(e) => setNewTask({ ...newTask, timeStart: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeFinish">Thời gian kết thúc</label>
          <input
            type="datetime-local"
            id="timeFinish"
            value={newTask.timeFinish}
            onChange={(e) => setNewTask({ ...newTask, timeFinish: e.target.value })}
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
                  onChange={handleUserChange}
                />
                <label htmlFor={user._id}>{user.fullName} ({user.email})</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit">Tạo công việc</button>
      </form>
    </div>
  );
};

export default CreateTask;