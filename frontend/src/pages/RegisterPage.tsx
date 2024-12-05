import React, { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import Default from "../components/AppBody/Default";
import Input from "../components/Input/Input";
import Button from "../components/Buttons/Button";
import Message from "../components/Message/Message";

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
        <Default>
            <div className="register-container">
                <h1>Create Your Account</h1>
                <form id="registerForm" onSubmit={handleRegister}>
                    <label htmlFor="username">Username:</label>
                    <Input 
                        type="text"
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                        placeholder="" 
                    />
                    <label htmlFor="email">Email:</label>
                    <Input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        placeholder="" 
                    />
                    <label htmlFor="firstName">First Name:</label>
                    <Input 
                        type="text" 
                        id="firstName" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="" 
                    />
                    <label htmlFor="lastName">Last Name:</label>
                    <Input 
                        type="text" 
                        id="lastName" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="" 
                    />
                    <label htmlFor="password">Password:</label>
                    <Input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        placeholder="" 
                    />
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <Input 
                        type="password" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required
                        placeholder="" 
                    />
                    <Button type="submit">Register</Button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
                {errorMessage && <Message className="error-message">{errorMessage}</Message>}
                {successMessage && <Message className="success-message">{successMessage}</Message>}
            </div>
        </Default>
    );
}

export default Register;