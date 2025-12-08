import React from 'react';
import UserSelector from '../components/UserSelector';
import HamburgerMenu from '../components/HamburgerMenu';
import './Home.scss';

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

export default Home;
