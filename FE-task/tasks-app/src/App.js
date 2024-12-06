import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tasks from './Task/Task.js';
import TaskDetail from './Task/TaskDetail.js';
import CreateTask from './Task/CreateTask.js'; // Import component CreateTask
import EditTask from './Task/EditTask'; // Import component EditTask
import Register from './User/Register';
import Login from './User/Login'; // Import component Login
import ForgotPassword from './User/ForgotPassword'; // Import component ForgotPassword
import OtpPassword from './User/OtpPassword'; // Import component OtpPassword
import ResetPassword from './User/ResetPassword'; // Import component ResetPassword
import UserInfo from './User/UserInfo'; // Import component UserInfo

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/create" element={<CreateTask/>} />
        <Route path="/tasks/edit/:id" element={<EditTask/>} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/password/forgot" element={<ForgotPassword />} />
        <Route path="/users/password/otp" element={<OtpPassword />} />
        <Route path="/users/password/reset" element={<ResetPassword />} />
        <Route path="/users/detail" element={<UserInfo />} />
      </Routes>
    </Router>
  );
};

export default App;