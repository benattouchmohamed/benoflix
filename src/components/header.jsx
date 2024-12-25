import React from 'react';
import { Link } from 'react-router-dom';
import './header.css'; // Import the header styles
import logo from './logo.png'; // Import the logo image

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
      <Link to="/">
          <img src={logo} alt="Benoflix Logo" /> {/* Logo image */}
        </Link>
      </div>
     

      <nav className="navigation">
        
      </nav>
      <div className="welcome-message">
        <p>Welcome to Benoflix!</p>
      </div>
    </header>
  );
};

export default Header;
