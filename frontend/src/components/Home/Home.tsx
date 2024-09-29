import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Home.css';

type Links = {
  liked_songs?: string;
  recommended?: string;
  my_artists?: string;
  search?: string;
  my_playlists?: string;
};

function Home() {
  const [links, setLinks] = useState<Links | null>(null); // Initial state as null to handle undefined case
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/home', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.body) {
          setLinks(data.body); // Ensure that data.body exists
        } else {
          throw new Error('Invalid data received');
        }
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error during fetch:', error);
        setError('You need to log in');
        localStorage.removeItem('token');  // Clear token on error
        navigate('/login');  // Redirect to login using navigate
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  // Guard against `links` being null or undefined
  return (
    <div>
      <h1>Welcome to Your Home Page</h1>
      <nav>
        <ul>
          {links?.liked_songs && <li><Link to={links.liked_songs}>Liked Songs</Link></li>}
          {links?.recommended && <li><Link to={links.recommended}>Recommended</Link></li>}
          {links?.my_artists && <li><Link to={links.my_artists}>My Artists</Link></li>}
          {links?.search && <li><Link to={links.search}>Search</Link></li>}
          {links?.my_playlists && <li><Link to={links.my_playlists}>My Playlists</Link></li>}
        </ul>
        {links && Object.keys(links).length === 0 && <li>No links available.</li>} {/* Handle empty links */}
      </nav>
      <footer>
        <button onClick={() => {
          localStorage.removeItem('token');
          setLinks(null);  // Clear links
          setError(null);  // Clear any errors
          setLoading(false);  // Stop loading
          navigate('/login');  // Redirect to login
        }}>Logout</button>
      </footer>
    </div>
  );
}

export default Home;
