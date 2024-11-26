import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tasks from './Task/Task.js';
import TaskDetail from './Task/TaskDetail.js';
import CreateTask from './Task/CreateTask.js'; // Import component CreateTask

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="/tasks/create" element={<CreateTask/>} />
      </Routes>
    </Router>
  );
};

export default App;