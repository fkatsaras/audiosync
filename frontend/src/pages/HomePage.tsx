import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import Link
import '../styles/HomePage.css';
import Navbar from '../components/Navbar/Navbar';
import AppBody from '../components/AppBody/AppBody';
import LoadingDots from '../components/LoadingDots/LoadingDots';
import Message from '../components/Message/Message';
import ProfileBar from '../components/ProfileBar/ProfileBar';

interface UserSessionProps {
  userId?: string;
  username?: string;
}

type Links = {
  liked_songs?: string;
  recommended?: string;
  my_artists?: string;
  search?: string;
  my_playlists?: string;
};

const Home: React.FC<UserSessionProps> = ({ userId, username }) => {
  const [links, setLinks] = useState<Links | null>(null); // Initial state as null to handle undefined case
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // const authorizeWithSpotify = async () => {
  //   try {
  //     const response = await fetch('/api/v1/spotify/login', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });

  //     console.log(response);

  //     if (!response.ok) {
  //       throw new Error('Failed to authorize with Spotify');
  //     }

  //     const data = await response.json();

  //     window.location.href = data.body.auth_url;
  //   } catch (error) {
  //     console.error('Error authorizing with Spotify:', error);
  //     setError('Could not authorize with Spotify. Please try again.');
  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/home', {
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

  if (loading) return (
    <div>
        <AppBody>
            <Navbar userId={userId || ''} username={username || ''} />
                <LoadingDots />
            <ProfileBar userId={userId || ''} username={username || ''}/>
        </AppBody>
    </div>
  )
  if (error) return <Message className='error-message'>{error}</Message>;

  return (
    <div className='home-container'>
      <Navbar userId={userId || ''} username={username || ''} />
      <AppBody>
        <h1>Welcome to Your Home Page</h1>
      </AppBody>
      <ProfileBar userId={userId || ''} username={username || ''}/>
    </div>
  );
}

export default Home;
