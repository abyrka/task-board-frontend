import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HamburgerMenu.scss';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu">
      <button className="hamburger-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      {isOpen && (
        <nav className="hamburger-nav">
          <ul>
            <li>
              <Link to="/users" onClick={() => setIsOpen(false)}>
                Users
              </Link>
            </li>
            <li>
              <Link to="/boards" onClick={() => setIsOpen(false)}>
                Boards
              </Link>
            </li>
            <li>
              <Link to="/history" onClick={() => setIsOpen(false)}>
                History
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default HamburgerMenu;
