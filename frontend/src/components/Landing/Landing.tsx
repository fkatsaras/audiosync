import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    if (localStorage.getItem('token')) {
      navigate('api/v1/home');
    }
  }, [navigate]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <h1>Welcome to AudioSync!</h1>
      <p>To get started, please login</p>
      <button onClick={handleLoginClick} className="login-link">
        Login
      </button>
    </div>
  );
}

export default Landing;