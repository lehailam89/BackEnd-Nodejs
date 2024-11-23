import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tasks from './Task/Task.js';
import TaskDetail from './Task/TaskDetail.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
      </Routes>
    </Router>
  );
};

export default App;