import React, { useEffect, useState } from "react";
import { Playlist } from "../types/data";
import '../styles/PlaylistPage.css';
import ResultItem from "../components/ResultItem/ResultItem";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import likedSongsCover from '../assets/images/liked_songs_cover.svg';
import defaultSongCover from '../assets/images/song_default_cover.svg';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../styles/LikedSongsPage.css';
import { useUser } from "../context/UserContext";


const LikedSongsPlaylist: React.FC = () => {
    const user = useUser();

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [playlistId, setPlaylistId] = useState<number | null>(null);
    const [loadedItems, setLoadedItems] = useState<{ [key: string]: boolean }>({});
    

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`/api/v1/users/${user?.userId}/liked-songs`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPlaylist(data.body);
                    setPlaylistId(data.body.id); // Set playlistId from response

                    // Set all songs as "loaded"
                    setLoadedItems((prev) => {
                        const newLoadedItems = data.body.songs.reduce((acc: { [key: string]: boolean }, song: any) => {
                            acc[song.id] = true; // Mark song as loaded
                            return acc;
                        }, {});
                        return { ...prev, ...newLoadedItems };
                    });
                } else {
                    setError('Playlist not found');
                }
            } catch (error) {
                setError(`Error fetching playlist data: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [user?.userId]);

    // Function to handle reordering
    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const updatedSongs = Array.from(playlist?.songs || []);
        const [movedItem] = updatedSongs.splice(result.source.index, 1);
        updatedSongs.splice(result.destination.index, 0, movedItem);

        // Add 'order' field based on the new position
        const orderedSongs = updatedSongs.map((song, index) => ({
            ...song,
            order: index + 1, // Assuming order starts from 1
        }));

        setPlaylist({ ...playlist!, songs: orderedSongs });

        // Send updated order to the backend
        const updatePlaylist = async () => {
            if (playlistId) {
                await fetch(`/api/v1/users/${user?.userId}/playlists?playlistId=${playlistId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...playlist, songs: orderedSongs }),
                });
            }
        };

        updatePlaylist();
    };

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;

    return (
        <div className="liked-songs-playlist-container">
            {playlist && (
                <div className="liked-songs-playlist-content-container">
                    <div className="liked-songs-playlist-info">
                        <h1>{playlist.title}</h1>
                        <img
                            src={playlist.cover ? playlist.cover : likedSongsCover}
                            alt={`Liked Songs cover`}
                            className="liked-songs-playlist-cover"
                        />
                    </div>
                    <div className="liked-songs-playlist-songs">
                        <h2>Songs</h2>
                        {playlist.songs && playlist.songs.length > 0 ? (
                            <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable 
                                droppableId="songs"
                            >
                                {(provided) => (
                                    <ul {...provided.droppableProps} ref={provided.innerRef}>
                                        {playlist.songs?.map((song, index) => (
                                            <Draggable 
                                                key={song.id.toString()}
                                                draggableId={song.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="draggable-container"
                                                    >
                                                        <ResultItem 
                                                            key={song.id}
                                                            id={song.id}
                                                            imageSrc={song.cover ? song.cover : defaultSongCover}
                                                            title={song.title}
                                                            subtitle={`${song.artist}`}
                                                            linkPath={`/songs`}
                                                            altText={`${song.title} cover`}
                                                            className={`song-result ${loadedItems[song.id] ? 'loaded' : ''}`}
                                                            isLoading={loading}     
                                                        />
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                        ) : (
                            <p>No liked songs</p>
                        )}
                    </div>
                </div>
            )}
        </div>
        
    );
};

export default LikedSongsPlaylist;
