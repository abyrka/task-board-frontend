import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CreateUser from './components/CreateUser';
import CreateBoard from './components/CreateBoard';

const Home: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Board</h1>
        <p>Use the links below to create users and boards.</p>
        <nav>
          <ul>
            <li><Link to="/create-user">Create User</Link></li>
            <li><Link to="/create-board">Create Board</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/create-board" element={<CreateBoard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
