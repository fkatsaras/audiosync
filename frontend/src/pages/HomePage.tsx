import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import Link
import '../styles/HomePage.css';
import Navbar from '../components/Navbar/Navbar';
import AppBody from '../components/AppBody/AppBody';

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
        const response = await fetch('api/v1/home', {
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

  console.log(links); // Dummy !TODO! Change what will be returned from the backend

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  // Guard against `links` being null or undefined
  return (
    <div className='home-container'>
      <Navbar />
      <AppBody>
        <h1>Welcome to Your Home Page</h1>
      </AppBody>
    </div>
  );
}

export default Home;
