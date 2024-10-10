import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await fetch('api/v1/users/login', { // Sends response to the /login route in the backend, with a JSON : {usernamee, password}
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Get the errror message from the backend response
                setErrorMessage(errorData.message);
                throw new Error('Login failed');
            }
    
            // Ensure the response is successful
            if (response.status === 200) {
                const data = await response.json();
                console.log('Token received:', data.token);

                // Store the token in localStorage
                localStorage.setItem('token', data.token);

                // Navigate to the home page
                navigate('/home');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed, please try again.');
            }
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
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default Login;
