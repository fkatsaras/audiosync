import React, { useEffect, useState } from 'react';
import { Playlist } from '../types/data';
import LoadingDots from '../components/LoadingDots/LoadingDots';
import Message from '../components/Message/Message';
import Button from '../components/Buttons/Button';
import PopUp from '../components/PopUp/PopUp';
import Input from '../components/Input/Input';
import Options from '../components/Buttons/Options';
import '../styles/MyPlaylistsPage.css';
import { useUser } from '../context/UserContext';
import PlaylistResultItem from '../components/ResultItem/PlaylistResultItem';

/**
 * MyPlaylistsPage component allows users to view their playlists.
 * It fetches the playlists from the backend and displays them.
 * 
 * @component
 * @returns {JSX.Element} The MyPlaylistsPage component UI.
 */

const MyPlaylistsPage: React.FC = () => {
    const user = useUser();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false); // State for popup
    const [newPlaylistName, setNewPlaylistName] = useState<string>('');
    const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState<boolean>(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<number | null>(null);
    // const [hasMorePlaylists, setHasMorePlaylists] = useState<boolean>(true);      // Tracks if there are more playlists !TODO! Implement a show more button here as well
    // State for managing rendering / loading of the components
    const [loadedItems, setLoadedItems] = useState<{ [key: string] : boolean }>({});

    useEffect(() => {
        // Mark all loaded artists and songs as "loaded" after fetch
        setTimeout(() => {
            setLoadedItems((prev) => ({
                ...prev,
                ...playlists.reduce((acc, playlist) => ({ ...acc, [playlist.id]: true }), {}),
            }));
        }, 100);  // Small delay for smoothness
    }, [playlists]);


    useEffect(() => {
        const fetchPlaylists = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/v1/users/${user?.userId}/my-playlists`, {
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
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [user?.userId]);

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) {
            alert('Playlist name cannot be empty.');    // TODO : Transport this to the backend
            return;
        }

        try {
            const response = await fetch(`/api/v1/users/${user?.userId}/my-playlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title: newPlaylistName }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const newPlaylist = await response.json();
            setPlaylists((prev) => [...prev, newPlaylist]);
            setIsPopUpOpen(false);
            setNewPlaylistName('');
        } catch (error: any) {
            setError(error.message);
        }
    };

    const confirmDeletePlalist = (playlistId: number) => {
        setPlaylistToDelete(playlistId);
        setIsDeletePopUpOpen(true);
    };

    const handleDeletePlaylist = async () => {
        if (!playlistToDelete) return;

        try {
            const response = await fetch(`/api/v1/users/${user?.userId}/my-playlists?playlistId=${playlistToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status} : ${response.statusText}`);
            }

            setPlaylists((prev) => prev.filter((playlist) => playlist.id !== playlistToDelete)) // After deletion playlists are filtered to exclude deleted playlist
            setPlaylistToDelete(null);  // Cleanup
            setIsDeletePopUpOpen(false);
        } catch (error: any) {
            setError(error.message);
        }
    }

    if (loading) return <LoadingDots />;

    return (
        <div className='playlists-container'>
                <h1 className='header'>Your Playlists</h1>
                <div className='buttons-container'>
                    <Button 
                        className=''
                        onClick={() => setIsPopUpOpen(true)}>
                        New +
                    </Button>
                </div>
                {loading && <LoadingDots />}
                {error && <Message className='error-message'>{error}</Message>}
                <ul>
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <li key={playlist.id}>
                                <PlaylistResultItem
                                    className={`playlist-result ${loadedItems[playlist.id] ? 'loaded' : ''}`}
                                    playlist={playlist}
                                    isLoading={loading}                                    
                                    optionsComponent={ !playlist.isLikedSongs &&    // User cant edit their Liked Songs Playlist
                                        <Options 
                                            onOptionSelect={(value) => 
                                                value === 'delete'
                                                    ? confirmDeletePlalist(playlist.id)
                                                    : console.log(`${value} option pressed`)                                                
                                            }
                                            onClose={() => console.log('TODO Options popup closed')}
                                        />
                                    }
                                />
                            </li>
                        ))
                    ) : (
                        !loading && <Message className='info-message'>No playlists found.</Message>
                    )}
                </ul>
            {isPopUpOpen && (
                <PopUp
                    title='Create New Playlist'
                    onConfirm={handleCreatePlaylist}
                    onCancel={() => {setIsPopUpOpen(false); setError('') }} // Clear error when canceling
                >
                    <Input 
                        id="playlist-name" 
                        type="text" 
                        placeholder="Give a name to your Playlist." 
                        value={newPlaylistName} 
                        onChange={(e) => setNewPlaylistName(e.target.value)} 
                        className="rectangular"
                    />
                    {error && <Message className='error-message'>{error}</Message>} { /* Display error message inside the popup */}
                </PopUp>
            )}

            {isDeletePopUpOpen && (
                <PopUp
                    title='Confirm Deletion'
                    onConfirm={handleDeletePlaylist}
                    onCancel={() => {
                        setIsDeletePopUpOpen(false);
                        setPlaylistToDelete(null);
                    }}
                >
                    <p>Are you sure you want to delete this Playlist?</p>
                </PopUp>
            )}
        </div>
    );
};

export default MyPlaylistsPage;
