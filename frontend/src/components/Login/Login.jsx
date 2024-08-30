import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('/login', { // Sends response to the /login route in the backend, with a JSON : {usernamee, password}
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (!response.ok) {
                throw new Error('Login failed');
            }
    
            const data = await response.json();
            console.log('Token received:', data.token);
    
            // Store the token in localStorage or sessionStorage
            localStorage.setItem('token', data.token);
    
            // Redirect to home page or update state
            navigate('/home');
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome to AudioSync</h1>
            <form id="loginForm" onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input 
                  type="text" 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
                <label htmlFor="password">Password:</label>
                <input 
                  type="password" 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
