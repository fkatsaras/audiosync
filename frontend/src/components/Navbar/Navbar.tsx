import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import Button from "../Buttons/Button";

interface UserSessionProps {
    userId: string;
    username: string;
}

const Navbar: React.FC<UserSessionProps> = ({ userId, username }) => {

    const navigate = useNavigate();

    const links = {
        liked_songs: '/liked-songs',
        recommended: '/recommended',
        my_artists: '/my-artists',
        search: '/search',
        my_playlists: `/${userId}/my-playlists` // Dynamically insert userId here
    };


    const handleLogout = async () => {

        try {
            const response = await fetch('/api/v1/users/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,  // Send the username as part of the body
                }),
            
            });

            if(response.ok) {
                // If the logout call is successful remove the token
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error('Logout failed:', await response.text());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <nav className="navbar">
                <ul className="navbar-list">
                    <li>
                        <Button className="navbar-home-button">
                            <Link to='/'>Home</Link>
                        </Button>   {/* TODO: Integrate the link component inside the button component */}
                    </li>
                    {links?.liked_songs && (
                        <li className="navbar-item">
                            <Link to={links.liked_songs}>Liked Songs</Link>
                        </li>
                    )}
                    {links?.my_artists && (
                        <li className="navbar-item">
                            <Link to={links.my_artists}>Your Artists</Link>
                        </li>
                    )}
                    {links?.recommended && (
                        <li className="navbar-item">
                            <Link to={links.recommended}>Recommended For You</Link>
                        </li>
                    )}
                    {links?.my_playlists && (
                        <li className="navbar-item">
                            <Link to={links.my_playlists}>Your Playlists</Link>
                        </li>
                    )}
                    {links?.search && (
                        <li className="navbar-item">
                            <Link to={links.search}>Search</Link>
                        </li>
                    )}
                </ul>
    
                <ul className="navbar-buttons">
                    <li>
                        <Button onClick={handleLogout} className="logout-button">Logout</Button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;