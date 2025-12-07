import React from 'react';
import './App.scss';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import CreateBoard from './components/CreateBoard';
import BoardList from './components/BoardList';
import UserList from './components/UserList';
import UserSelector from './components/UserSelector';
import HamburgerMenu from './components/HamburgerMenu';
import { CurrentUserProvider } from './context/CurrentUserContext';

const Home: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-content">
          <HamburgerMenu />
          <h1 className="App-title">Task Board</h1>
          <div className="App-user-selector">
            <UserSelector />
          </div>
        </div>
      </header>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CurrentUserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-board" element={<CreateBoard />} />
        </Routes>
      </BrowserRouter>
    </CurrentUserProvider>
  );
};

export default App;
