import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingDots from '../LoadingDots/LoadingDots';
import Message from '../Message/Message';

const SpotifyAuth: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code'); // Get the auth code from the URL

            if (code) {
                try {
                    const response = await fetch(`/api/v1/spotify/callback?code=${code}`, {
                        method: 'GET',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to get Spotify token.');
                    }

                    const data = await response.json();
                    console.log('Token data:', data.body);

                    // Redirect back to home after successful retrieval
                    navigate('/home');
                } catch (error) {
                    console.error('Error fetching Spotify token:', error);
                    setError('Failed to fetch token. Please try again.'); // Set error message
                } finally {
                    setLoading(false); // Stop loading once done
                }
            } else {
                console.error('No authorization code found');
                setError('No authorization code found.'); // Set error message
                setLoading(false); // Stop loading
                navigate('/home');
            }
        };

        fetchToken();
    }, [navigate]);

    // If loading, return the LoadingDots component
    if (loading) {
        return (
            <div>
                <LoadingDots message='Please wait while we obtain your Spotify Player token...'/>
            </div>
        );
    }

    // If there's an error, you can display the error message here
    if (error) {
        return <Message className='error-message'>{error}</Message>
    }

    return null; // Return null or any other fallback UI if needed
}

export default SpotifyAuth;
