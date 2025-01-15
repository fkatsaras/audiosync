import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import Button from "../Buttons/Button";
import { AiFillHome } from 'react-icons/ai';

interface UserSessionProps {
    userId: string;
    username: string;
}

const Navbar: React.FC<UserSessionProps> = ({ userId, username }) => {

    // const navigate = useNavigate();

    const links = {
        liked_songs: `/${userId}/liked-songs`,
        recommended: `/${userId}/recommended`,
        my_artists: `/${userId}/my-artists`,
        search: '/search',
        my_playlists: `/${userId}/my-playlists` // Dynamically insert userId here
    };

    return (
        <div>
            <nav className="navbar">
                <div className="top-row-buttons">
                    <Button className="navbar-home-button">
                        <Link to='/home'>
                            <AiFillHome size={24} />
                        </Link>
                    </Button>   {/* TODO: Integrate the link component inside the button component */}
                </div>
                <ul className="navbar-list">
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
                    {/* <li>
                        <Button onClick={handleLogout} className="logout-button">Logout</Button>
                    </li> */}
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;