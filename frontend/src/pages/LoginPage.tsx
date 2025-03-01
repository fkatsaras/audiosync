import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Default from "../components/AppBody/Default";
import '../styles/LoginPage.css'
import Input from "../components/Input/Input";
import Button from "../components/Buttons/Button";
import Message from "../components/Message/Message";


const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await fetch(`${API}/users/login`, { // Sends response to the /login route in the backend, with a JSON : {usernamee, password}
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Get the errror message from the backend response
                setErrorMessage(errorData.message);
                throw new Error('Login failed');
            }
    
            // Ensure the response is successful
            if (response.status === 200) {
                const data = await response.json();
                console.log('Token received:', data.body.token);

                // Store the token in localStorage
                localStorage.setItem('token', data.body.token);

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
        <Default>
            <div className="login-container">
                <div className="login-form">
                    <h1>Welcome to AudioSync</h1>
                    <form id="loginForm" onSubmit={handleLogin}>
                        <label htmlFor="username">Username:</label>
                        <Input 
                          id="username"
                          placeholder=""
                          type="text"  
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                          required 
                        />
                        <label htmlFor="password">Password:</label>
                        <Input 
                          id="password"
                          type="password" 
                          placeholder="" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                        />
                        <Button type="submit" className="login-button">Login</Button>
                    </form>
                </div>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
                {errorMessage && <Message className="error-message">{errorMessage}</Message>}
            </div>
        </Default>
    );
}

export default Login;
