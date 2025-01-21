import React , { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Song } from "../types/data";
import AppBody from "../components/AppBody/AppBody";
import Message from "../components/Message/Message";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import Navbar from "../components/Navbar/Navbar";
import LikeButton from "../components/Buttons/LikeButton";
import '../styles/SongPage.css'
import ProfileBar from "../components/ProfileBar/ProfileBar";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import PlayButton from "../components/Buttons/PlayButton";

interface UserSessionProps {
    userId?: string;
    username?: string;
}

const SongPage: React.FC<UserSessionProps> = ({ userId, username  }) => {
    const { songId } = useParams<{ songId: string }>(); // Get song ID from URL parameters
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // State for the Audio Player
    // const [currentSong, setCurrentSong] = useState<AudioPlayerContextProps['currentSong'] | null>(null);
    // const { currentSong, audioRef, isPlaying } = useAudioPlayer();
    const { setCurrentSong, togglePlayPause, isPlaying } = useAudioPlayer();

    useEffect(() => {
        // Fetch the song details from the backend
        const fetchSong = async () => {
            try {
                const response = await fetch(`/api/v1/songs/${songId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data  = await response.json();
                    setSong(data.body); // Set the song data
                } else {
                    setError('Song not found');
                }
            } catch (err) {
                setError('Error fetching song data');
            } finally {
                setLoading(false);
            }
        };

        fetchSong();
    }, [songId]);

    const handleLikeToggle = async () => {
        if (!song) return;

        const action = song.liked ? 'DELETE' : 'POST';
        const endpoint = `/api/v1/users/${userId}/liked-songs?songId=${songId}`;

        const response = await fetch(endpoint, {
            method: action,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setSong(prevSong => ({
                ...prevSong!,
                liked: data.body.liked  // Update the songs liked status
            }));
            setMessage('Song added to Liked Songs');
        } else {
            const errorData = await response.json();
            setMessage(errorData.message);
        }
    };

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;

    // console.log({ currentSong, isPlaying, audioRef });


    return (
        <div>
            <AppBody>
                <Navbar userId={userId || ''} username={username || ''} />
                <div className="song-container">
                    { song ? (
                        <div className="song-info">
                            <h1>{song.title}</h1>
                            <LikeButton isLiked={song.liked} onToggle={handleLikeToggle}/>
                            <p>Artist: <Link to={`/artists/${song.artist_id}`}>{song.artist}</Link></p>
                            <p>Album: {song.album}</p>
                            <div className="song-image-container">
                                <img src={song.cover} alt={`${song.title} cover`} className="song-cover"/>
                                <PlayButton className="image-button" isPlaying={false} onToggle={() => {    // Override isPlaying to fix icon
                                    if (song) {
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
                                       }
                                    }}
                                />
                            </div>
                            {/* Additional song info here*/}
                            {/*
                             Display unfollow/follow/error message here
                             !TODO! Add timeout logic so that the follow message isnt permanent
                             */}
                            {message && <Message className="info-message">{message}</Message>}
                        </div>
                    ) : (
                        <Message className="info-message">Song not found.</Message>
                    )}
                </div>
            </AppBody>
            <ProfileBar userId={userId || ''} username={username || ''}/>
        </div>
    )
}

export default SongPage;
