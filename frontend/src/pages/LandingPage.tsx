import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBody from '../components/AppBody/AppBody';
import Button from '../components/Buttons/Button';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <AppBody>
      <div className="landing-container">
      <h1>Welcome to AudioSync!</h1>
      <p>To get started, please login</p>
      <Button onClick={handleLoginClick} className="login-link">
        Login
      </Button>
    </div>
    </AppBody>
  );
}

export default Landing;