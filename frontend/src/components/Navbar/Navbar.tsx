import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import { useUser } from "../../context/UserContext";

interface NavBarProps {
    style?: React.CSSProperties; // Optional style prop
  }

const Navbar: React.FC<NavBarProps> = ({ style }) => {

    const user = useUser();
    const links = {
        liked_songs: `/${user?.userId}/liked-songs`,
        recommended: `/${user?.userId}/recommended`,
        my_artists: `/${user?.userId}/my-artists`,
        search: '/search',
        my_playlists: `/${user?.userId}/my-playlists` // Dynamically insert userId here
    };

    return (
        <div>
            <nav className="navbar" style={style}>
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