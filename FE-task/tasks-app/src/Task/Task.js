import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Task.css'; // Tạo file CSS riêng nếu cần
import { TASKS_API_URL, USERS_API_URL } from '../config.js'; // Import URL API

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(''); // State để lưu trạng thái đã chọn
  const [sortKey, setSortKey] = useState(''); // State để lưu tiêu chí sắp xếp
  const [sortValue, setSortValue] = useState(''); // State để lưu giá trị sắp xếp
  const [currentPage, setCurrentPage] = useState(1); // State để lưu trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // State để lưu tổng số trang
  const [keyword, setKeyword] = useState(''); // State để lưu từ khóa tìm kiếm
  const [notification, setNotification] = useState(''); // State để lưu thông báo
  const [selectedTasks, setSelectedTasks] = useState([]); // State để lưu các nhiệm vụ đã chọn
  const [multiStatus, setMultiStatus] = useState(''); // State để lưu trạng thái mới cho các nhiệm vụ đã chọn
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    const sortKeyParam = params.get('sortKey');
    const sortValueParam = params.get('sortValue');
    const pageParam = params.get('page');
    const keywordParam = params.get('keyword');
    if (statusParam) {
      setStatus(statusParam);
    }
    if (sortKeyParam) {
      setSortKey(sortKeyParam);
    }
    if (sortValueParam) {
      setSortValue(sortValueParam);
    }
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }
    if (keywordParam) {
      setKeyword(keywordParam);
    }
  }, [location.search]);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      try {
        setUserInfo(JSON.parse(userInfo));
      } catch (error) {
        console.error("Lỗi khi phân tích cú pháp JSON:", error);
      }
    }

    // Gọi API để lấy dữ liệu
    axios
      .get(`${TASKS_API_URL}?status=${status}&sortKey=${sortKey}&sortValue=${sortValue}&page=${currentPage}&keyword=${keyword}`, { withCredentials: true })
      .then((response) => {
        setTasks(response.data.tasks || []);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setLoading(false);
      });

    // Cập nhật URL khi status, sortKey, sortValue, currentPage hoặc keyword thay đổi
    const params = new URLSearchParams(location.search);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    if (sortKey && sortValue) {
      params.set('sortKey', sortKey);
      params.set('sortValue', sortValue);
    } else {
      params.delete('sortKey');
      params.delete('sortValue');
    }
    if (keyword) {
      params.set('keyword', keyword);
    } else {
      params.delete('keyword');
    }
    params.set('page', currentPage);
    navigate({ search: params.toString() });
  }, [status, sortKey, sortValue, currentPage, keyword, navigate, location.search]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(e.target.elements.keyword.value);
  };

  const handleChangeStatus = (taskId, newStatus) => {
    axios
      .patch(`${TASKS_API_URL}/change-status/${taskId}`, { status: newStatus })
      .then((response) => {
        if (response.data.code === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === taskId ? { ...task, status: newStatus } : task
            )
          );
          setNotification('Cập nhật trạng thái thành công!');
          setTimeout(() => setNotification(''), 3000); // Ẩn thông báo sau 3 giây
        } else {
          console.error("Lỗi khi cập nhật trạng thái:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleChangeMultiStatus = () => {
    axios
      .patch(`${TASKS_API_URL}/change-multi`, {
        ids: selectedTasks,
        key: 'status',
        value: multiStatus,
      })
      .then((response) => {
        if (response.data.code === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              selectedTasks.includes(task._id) ? { ...task, status: multiStatus } : task
            )
          );
          setNotification('Cập nhật trạng thái nhiều nhiệm vụ thành công!');
          setTimeout(() => setNotification(''), 3000); // Ẩn thông báo sau 3 giây
          setSelectedTasks([]); // Xóa các nhiệm vụ đã chọn sau khi cập nhật
        } else {
          console.error("Lỗi khi cập nhật trạng thái nhiều nhiệm vụ:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleDeleteTask = (taskId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nhiệm vụ này?");
    if (confirmDelete) {
      axios
        .delete(`${TASKS_API_URL}/delete/${taskId}`)
        .then((response) => {
          if (response.data.code === 200) {
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            setNotification('Xóa nhiệm vụ thành công!');
            setTimeout(() => setNotification(''), 3000); // Ẩn thông báo sau 3 giây
          } else {
            console.error("Lỗi khi xóa nhiệm vụ:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  const handleDeleteMultiTasks = () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa các nhiệm vụ đã chọn?");
    if (confirmDelete) {
      axios
        .patch(`${TASKS_API_URL}/change-multi`, {
          ids: selectedTasks,
          key: 'delete',
          value: true,
        })
        .then((response) => {
          if (response.data.code === 200) {
            setTasks((prevTasks) => prevTasks.filter((task) => !selectedTasks.includes(task._id)));
            setNotification('Xóa nhiều nhiệm vụ thành công!');
            setTimeout(() => setNotification(''), 3000); // Ẩn thông báo sau 3 giây
            setSelectedTasks([]); // Xóa các nhiệm vụ đã chọn sau khi xóa
          } else {
            console.error("Lỗi khi xóa nhiều nhiệm vụ:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  const handleLogout = () => {
    axios
      .post(`${USERS_API_URL}/logout`, {}, { withCredentials: true })
      .then((response) => {
        if (response.data.code === 200) {
          setNotification('Đăng xuất thành công!');
          setTimeout(() => {
            setNotification('');
            navigate('/users/login'); // Điều hướng đến trang đăng nhập
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

  useEffect(() => {
    const nameUser = () => {
      axios
        .get(`${USERS_API_URL}/detail`, { withCredentials: true }) // Gửi yêu cầu với cookie
        .then((response) => {
          if (response.data.code === 200) {
            setUserInfo(response.data.info);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    };

    nameUser();
  }, []); // Chỉ chạy một lần khi component được render

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div>
        {userInfo ? <p>Xin chào, {userInfo.fullName}!</p> : <p>Đang tải thông tin người dùng...</p>}
      </div>
      <h1>Danh sách công việc</h1>
      {notification && <div className="notification">{notification}</div>}
      <div className="filter-container">
        <label htmlFor="status">Lọc theo trạng thái:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="initial">Initial</option>
          <option value="doing">doing</option>
          <option value="finish">finish</option>
          <option value="pending">pending</option>
          <option value="notFinish">notFinish</option>
        </select>
      </div>
      <div className="sort-container">
        <label htmlFor="sortKey">Sắp xếp theo:</label>
        <select
          id="sortKey"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">Chọn tiêu chí</option>
          <option value="title">Tiêu đề</option>
          <option value="createdAt">Ngày tạo</option>
        </select>
        <select
          id="sortValue"
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
        >
          <option value="">Chọn thứ tự</option>
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="keyword"
            placeholder="Tìm kiếm công việc"
            defaultValue={keyword}
          />
          <button type="submit">Tìm kiếm</button>
        </form>
      </div>
      <div className="multi-status-container">
        <label htmlFor="multiStatus">Đổi trạng thái nhiều nhiệm vụ:</label>
        <select
          id="multiStatus"
          value={multiStatus}
          onChange={(e) => setMultiStatus(e.target.value)}
        >
          <option value="">Chọn trạng thái</option>
          <option value="initial">Initial</option>
          <option value="doing">Doing</option>
          <option value="finish">Finish</option>
          <option value="pending">Pending</option>
          <option value="notFinish">Not Finish</option>
        </select>
        <button onClick={handleChangeMultiStatus} disabled={!selectedTasks.length || !multiStatus}>
          Cập nhật trạng thái
        </button>
        <button onClick={handleDeleteMultiTasks} disabled={!selectedTasks.length} className="btn btn-danger">
          Xóa nhiều nhiệm vụ
        </button>
      </div>
      <button onClick={() => navigate('/tasks/create')} className="btn btn-primary">
        Tạo công việc mới
      </button>
      <button onClick={() => navigate('/user-info')} className="btn btn-secondary">
        Xem thông tin cá nhân
      </button>
      <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={`task-item ${task.status}`}>
            <input
              type="checkbox"
              checked={selectedTasks.includes(task._id)}
              onChange={() => handleSelectTask(task._id)}
            />
            <h2>{task.title}</h2>
            <p>{task.status}</p>
            <select
              value={task.status}
              onChange={(e) => handleChangeStatus(task._id, e.target.value)}
            >
              <option value="initial">Initial</option>
              <option value="doing">Doing</option>
              <option value="finish">Finish</option>
              <option value="pending">Pending</option>
              <option value="notFinish">Not Finish</option>
            </select>
            <button onClick={() => navigate(`/tasks/${task._id}`)}>Xem chi tiết</button>
            <button onClick={() => navigate(`/tasks/edit/${task._id}`)}>Chỉnh sửa</button>
            <button onClick={() => handleDeleteTask(task._id)} className="btn btn-danger">Xóa</button>
          </li>
        ))}
      </ul>
      <div className="pagination-container">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Trang trước
        </button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default Tasks;