import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();


    const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        // Validate required fields
        if (!username || !password || !email) {
            setErrorMessage('Missing required fields for registration');
            return;
        }

        try {
            const response = await fetch('/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                }),
            });
            
            // Store the API response from the backend
            const data = await response.json();

            if (!response.ok) {
                if (data.message === "Username already exists") {
                    setErrorMessage("Username is already taken. Please choose a different one.")

                } else {
                    setErrorMessage(data.message);
                    throw new Error(data.message || 'Registration failed!');
                }
                return;
            }

            // If all is ok
            console.log('Registration successful', data);
            setSuccessMessage('Registration successful! You can now log in.');

            // Redirect to login 
            navigate('/login');
        } catch (error) {
            console.error('Error during registration: ', error);
            setErrorMessage( error + '. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h1>Create Your Account</h1>
            <form id="registerForm" onSubmit={handleRegister}>
                <label htmlFor="username">Username:</label>
                <input 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <label htmlFor="firstName">First Name:</label>
                <input 
                    type="text" 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                <label htmlFor="lastName">Last Name:</label>
                <input 
                    type="text" 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input 
                    type="password" 
                    id="confirmPassword" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Register</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
}

export default Register;