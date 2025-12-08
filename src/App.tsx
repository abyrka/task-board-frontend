import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import UserList from './pages/UserList';
import { CurrentUserProvider } from './context/CurrentUserContext';

const App: React.FC = () => {
  return (
    <CurrentUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
        </Routes>
      </BrowserRouter>
    </CurrentUserProvider>
  );
};

export default App;
