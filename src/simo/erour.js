import React from 'react';
import { Link } from 'react-router-dom';
import './erour.css'; // Import optional styles for the error page

const Error = () => {
  return (
    <div className="error-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
      <Link to="/" className="back-home">
        Go Back Home
      </Link>
    </div>
  );
};

export default Error;
