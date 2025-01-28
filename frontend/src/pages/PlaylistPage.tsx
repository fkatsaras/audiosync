import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Playlist, Song } from "../types/data";
import '../styles/PlaylistPage.css';
import AppBody from "../components/AppBody/AppBody";
import ResultItem from "../components/ResultItem/ResultItem";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import defaultPlaylistCover from '../assets/images/playlist_default_cover.svg';
import defaultSongCover from '../assets/images/song_default_cover.svg';
import likedSongsCover from '../assets/images/liked_songs_cover.svg';
import Navbar from "../components/Navbar/Navbar";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProfileBar from "../components/ProfileBar/ProfileBar";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface UserSessionProps {
    userId?: string;
    username?: string;
}

const PlaylistPage: React.FC<UserSessionProps> = ({ userId, username }) => {
    const { playlistId } = useParams<{ playlistId: string }>();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { setCurrentSong, togglePlayPause, isPlaying, currentSong } = useAudioPlayer();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`/api/v1/users/${userId}/playlists?playlistId=${playlistId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (response.ok) {
                    const playlistData = await response.json();
                    setPlaylist({
                        ...playlistData.body,
                        songs: playlistData.body.songs || [], // Default to empty array if songs is null
                    });

                    // Check if the playlist is the "Liked Songs" playlist
                    if (playlistData.isLikedSongs) {
                        playlistData.cover = likedSongsCover; // Set the cover to the imported image
                    }
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
    }, [playlistId, userId]);

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
            await fetch(`/api/v1/users/${userId}/playlists?playlistId=${playlistId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...playlist, songs: orderedSongs }),
            });
        };

        updatePlaylist();
    };

    const handlePlaySong = (song: Song) => {
        setCurrentSong({
            id: song.id,
            title: song.title,
            artist: song.artist,
            artist_id: song.artist_id,
            audio_url: song.audio_url,
            album: song.album,
            duration: song.duration,
            cover: song.cover,
            liked: song.liked,
            playlists: song.playlists,
            is_playing: true
        });
        togglePlayPause();
    };

    if (loading) return (
        <div>
            <AppBody>
                <Navbar userId={userId || ''} username={username || ''} />
                    <LoadingDots />
                <ProfileBar userId={userId || ''} username={username || ''}/>
            </AppBody>
        </div>
    );
    if (error) return <div>{error}</div>;

    return (
        <div>
            <AppBody>
                <Navbar userId={userId || ''} username={username || ''} />
                <div className="playlist-container">
                    {playlist && (
                        <div className="playlist-content-container">
                            <div className="playlist-info">
                                <h1>{playlist.title}</h1>
                                <img
                                    src={playlist.isLikedSongs? likedSongsCover : playlist.cover? playlist.cover : defaultPlaylistCover}
                                    alt={`${playlist.title} cover`}
                                    className="playlist-cover"
                                />
                            </div>
                            <div className="playlist-songs">
                                <h2>Songs</h2>
                                {playlist.songs && playlist.songs.length > 0 ? (
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable 
                                        droppableId="songs"
                                    >
                                        {(provided) => (
                                            <ul {...provided.droppableProps} ref={provided.innerRef}>
                                                {playlist.songs?.map((song, index) => song && ( // Defensive check : ensure song is not null before render
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
                                                                    className="song-result" 
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
                                    playlist.isLikedSongs ? <p>No Liked Songs</p> : <p>Add songs to this playlist</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </AppBody>
            <ProfileBar userId={userId || ''} username={username || ''}/>
        </div>
    );
};

export default PlaylistPage;
