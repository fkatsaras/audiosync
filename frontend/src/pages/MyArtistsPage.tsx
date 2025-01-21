import React, { useState, useEffect } from 'react';
import { Artist } from '../types/data'; 
import Navbar from '../components/Navbar/Navbar';
import Message from '../components/Message/Message';
import AppBody from '../components/AppBody/AppBody';
import LoadingDots from '../components/LoadingDots/LoadingDots';
import ResultItem from '../components/ResultItem/ResultItem';
import ProfileBar from '../components/ProfileBar/ProfileBar';


interface UserSessionProps {
    userId?: string;
    username?: string;
}
/**
 * MyArtistsPage component allows users to view their followed artists.
 * It fetches the artists from the backend and displays them.
 * 
 * @component
 * @returns {JSX.Element} The MyArtistsPage component UI.
 */
const  MyArtistsPage: React.FC<UserSessionProps> = ({ userId, username }) => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    

    useEffect(() => {
        const fetchArtists = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/v1/users/${userId}/artists`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status} : ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.body) {
                    setLoading(false);
                    return;
                }

                setArtists(data.body);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchArtists();
    }, [userId])

    console.log(artists);

    return (
        <div className='my-artists-container'>
            <Navbar userId={userId || ''} username={username || ''}/>
            <AppBody>
                <h1>Your Artists</h1>
                {loading && <LoadingDots />}
                {error && <Message className='error-message'>{error}</Message>}
                <ul>
                    {artists.length > 0 ? (
                        artists.map((artist) => (
                            <li key={artist.id}>
                                <ResultItem
                                    id={artist.id}
                                    imageSrc={artist.profile_picture}
                                    title={artist.name}
                                    subtitle=''
                                    linkPath={`/artists`}
                                    altText='Artist Profile Picture'
                                    className='artist-result'
                                />
                            </li>
                        ))
                    ) : (
                        !loading && <Message className='info-message'>No followed artists.</Message>
                    )}
                </ul>
            </AppBody>
            <ProfileBar userId={userId || ''} username={username || ''} />
        </div>
    );
};

export default MyArtistsPage;