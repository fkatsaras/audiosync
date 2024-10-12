import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import Button from "../Button/Button";


function Navbar() {

    const navigate = useNavigate();

    const links = {
        liked_songs: '/liked-songs',
        recommended: '/recommended',
        my_artists: '/my-artists',
        search: '/search',
        my_playlists: '/my-playlists'
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div>
            <nav className="navbar">
                <ul className="navbar-list">
                    {links?.liked_songs && <li className="navbar-item"><Link to={links.liked_songs}>Liked Songs</Link></li>}
                    {links?.my_artists && <li className="navbar-item"><Link to={links.my_artists}>Your Artists</Link></li>}
                    {links?.recommended && <li className="navbar-item"><Link to={links.recommended}>Recommended For You</Link></li>}
                    {links?.my_playlists && <li className="navbar-item"><Link to={links.my_playlists}>Your Playlists</Link></li>}
                    {links?.search && <li className="navbar-item"><Link to={links.search}>Search</Link></li>}
                    <li>
                    <Button onClick={handleLogout} className="logout-button">Logout</Button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;