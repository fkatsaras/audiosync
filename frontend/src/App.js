import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
// import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/home" 
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />
        <Route 
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;