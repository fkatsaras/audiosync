import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Playlist } from '../types/data';
import Navbar from '../components/Navbar/Navbar';
import AppBody from '../components/AppBody/AppBody';
import LoadingDots from '../components/LoadingDots/LoadingDots';
import Message from '../components/Message/Message';
import ResultItem from '../components/ResultItem/ResultItem';
import Button from '../components/Buttons/Button';
import defaultCover from '../assets/images/playlist_default_cover.svg';
// import '../styles/MyPlaylists.css'

interface UserSessionProps {
    userId?: string;
    username?: string;
  }
/**
 * MyPlaylistsPage component allows users to view their playlists.
 * It fetches the playlists from the backend and displays them.
 * 
 * @component
 * @returns {JSX.Element} The MyPlaylistsPage component UI.
 */

const MyPlaylistsPage: React.FC<UserSessionProps> = ({ userId, username }) => {

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    // const [hasMorePlaylists, setHasMorePlaylists] = useState<boolean>(true);      // Tracks if there are more playlists !TODO! Implement a show more button here as well


    useEffect(() => {
        const fetchPlaylists = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/v1/users/${userId}/my-playlists`, {
                    method: 'GET',
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
        
                const data = await response.json();
                
                if (!data.body) {
                    setLoading(false);
                    return;
                }
        
                setPlaylists(data.body);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [userId]);

    return (
        <div className='playlists-container'>
            <Navbar userId={userId || ''} username={username || ''}/>
            <AppBody>
                <Button><Link to='/'>Home</Link></Button>   {/* TODO: Integrate the link component inside the button component*/}
                <h1>Your Playlists</h1>
                {loading && <LoadingDots />}
                {error && <Message className='error-message'>{error}</Message>}
                <ul>
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <li key={playlist.id}>
                                <ResultItem
                                    id={playlist.id}
                                    imageSrc={playlist.cover? playlist.cover : defaultCover}
                                    title={playlist.title}
                                    subtitle={
                                        playlist.song_ids && playlist.song_ids.length > 0
                                            ? `${playlist.song_ids.length} songs`
                                            : 'No songs added'
                                    }
                                    linkPath={`/${userId}/playlists`}
                                    altText='Playlist cover'
                                    className='playlist-result-image'
                                />
                            </li>
                        ))
                    ) : (
                        !loading && <Message className='info-message'>No playlists found.</Message>
                    )}
                </ul>
            </AppBody>
        </div>
    );
};

export default MyPlaylistsPage;
