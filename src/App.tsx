import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import BoardList from './pages/board-list/BoardList';
import TaskList from './pages/task/TaskList';
import UserList from './pages/user-list/UserList';
import { CurrentUserProvider } from './context/CurrentUserContext';

const App: React.FC = () => {
  return (
    <CurrentUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/:id/tasks" element={<TaskList />} />
        </Routes>
      </BrowserRouter>
    </CurrentUserProvider>
  );
};

export default App;
