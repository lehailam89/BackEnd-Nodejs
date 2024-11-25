import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Task.css'; // Tạo file CSS riêng nếu cần
import { TASKS_API_URL } from '../config.js'; // Import URL API

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(''); // State để lưu trạng thái đã chọn
  const [sortKey, setSortKey] = useState(''); // State để lưu tiêu chí sắp xếp
  const [sortValue, setSortValue] = useState(''); // State để lưu giá trị sắp xếp
  const [currentPage, setCurrentPage] = useState(1); // State để lưu trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // State để lưu tổng số trang
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    const sortKeyParam = params.get('sortKey');
    const sortValueParam = params.get('sortValue');
    const pageParam = params.get('page');
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
  }, [location.search]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu
    axios
      .get(`${TASKS_API_URL}?status=${status}&sortKey=${sortKey}&sortValue=${sortValue}&page=${currentPage}`)
      .then((response) => {
        setTasks(response.data.tasks || []);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        setLoading(false);
      });

    // Cập nhật URL khi status, sortKey, sortValue hoặc currentPage thay đổi
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
    params.set('page', currentPage);
    navigate({ search: params.toString() });
  }, [status, sortKey, sortValue, currentPage, navigate, location.search]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="tasks-container">
      <h1>Danh sách công việc</h1>
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
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={`task-item ${task.status}`}>
            <h2>{task.title}</h2>
            <button onClick={() => navigate(`/tasks/${task._id}`)}>Xem chi tiết</button>
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