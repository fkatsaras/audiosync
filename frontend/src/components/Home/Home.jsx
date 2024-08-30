import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css';

function Home() {
  const [links, setLinks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/home', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setLinks(data.links);
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

  return (
    <div>
      <h1>Welcome to Your Home Page</h1>
      <nav>
        <ul>
          <li><a href={links.liked_songs}>Liked Songs</a></li>
          <li><a href={links.recommended}>Recommended</a></li>
          <li><a href={links.my_artists}>My Artists</a></li>
          <li><a href={links.search}>Search</a></li>
          <li><a href={links.my_playlists}>My Playlists</a></li>
        </ul>
      </nav>
      <footer>
        <button onClick={() => {
          localStorage.removeItem('token');
          setLinks({});  // Clear links
          setError(null);  // Clear any errors
          setLoading(false);  // Stop loading
          navigate('/login');  // Redirect to login
        }}>Logout</button>
      </footer>
    </div>
  );
}

export default Home;
