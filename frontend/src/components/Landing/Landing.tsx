import React from 'react';
import { Link } from 'react-router-dom';
// import 'Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      <h1>Welcome to AudioSync!</h1>
      <p>To get started, please login</p>
      <Link to="/login" className="login-link">Login</Link>
    </div>
  );
}

export default Landing;
