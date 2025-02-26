import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import Link
import '../styles/HomePage.css';
import LoadingDots from '../components/LoadingDots/LoadingDots';
import Message from '../components/Message/Message';

type Links = {
  liked_songs?: string;
  recommended?: string;
  my_artists?: string;
  search?: string;
  my_playlists?: string;
};

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";


const Home: React.FC = () => {

  const [links, setLinks] = useState<Links | null>(null); // Initial state as null to handle undefined case
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/home`, {
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

  if (loading) return <LoadingDots />;
  if (error) return <Message className='error-message'>{error}</Message>;

  return (
    <div className='home-container'>
        <h1>Welcome to Your Home Page</h1>
    </div>
  );
}

export default Home;
