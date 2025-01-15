import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Default from '../components/AppBody/Default';
import Button from '../components/Buttons/Button';
import '../styles/LandingPage.css'
import logo from '../assets/images/logo.svg';  

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
    <Default>
      <div className="landing-container">
        <img src={logo} alt='AudioSync Logo' className='landing-logo'/>
      <h1>Welcome to AudioSync!</h1>
      <p>To get started, please login</p>
      <Button onClick={handleLoginClick} className="login-link">
        Login
      </Button>
    </div>
    </Default>
  );
}

export default Landing;