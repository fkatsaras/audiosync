import React , { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Song } from "../types/data";
import Message from "../components/Message/Message";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import LikeButton from "../components/Buttons/LikeButton";
import '../styles/SongPage.css'
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import PlayButton from "../components/Buttons/PlayButton";
import { useUser } from "../context/UserContext";
import { LiaMicrophoneAltSolid } from "react-icons/lia";


const SongPage: React.FC = () => {
    const user = useUser();
    const { songId } = useParams<{ songId: string }>(); // Get song ID from URL parameters
    const location = useLocation();
    const navigate = useNavigate();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [likeMessage, setLikeMessage] = useState<string | null>(null);
    const [viewMode, setViewMode] =useState<'song' | 'lyrics'>('song');
    const [lyrics, setLyrics] = useState<string | null>(null);

    // Use the AudioPlayer through its hook 
    const { setCurrentSong, togglePlayPause, isPlaying } = useAudioPlayer();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const initialView = queryParams.get("view") === "lyrics" ? "lyrics" : "song";
        setViewMode(initialView);

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
    }, [songId, location.search]);

    useEffect(() => {
        const fetchLyrics = async () => {
            if (viewMode === "lyrics" && !lyrics) {
                try {
                    const response = await fetch(`/api/v1/songs/${songId}/lyrics`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });
                    const lyricsData = await response.json();
                    setLyrics(lyricsData.body.lyrics);
                } catch {
                    setLyrics("Lyrics not available");
                }
            }
        };

        fetchLyrics();
    }, [viewMode, songId]);

    const handleLikeToggle = async () => {
        if (!song) return;

        const action = song.liked ? 'DELETE' : 'POST';
        const endpoint = `/api/v1/users/${user?.userId}/liked-songs?songId=${songId}`;

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
            setLikeMessage(data.body.liked ? 'Song Liked!' : "");

            setTimeout(() => {
                setLikeMessage(null);
            },6000);
        } else {
            const errorData = await response.json();
            setMessage(errorData.message);
        }
    };

    const handleToggleView = () => {
        const newViewMode = viewMode === "song" ? "lyrics" : "song";
        setViewMode(newViewMode);
    
        // Update the URL without refreshing
        navigate(`/songs/${songId}?view=${newViewMode}`, { replace: true });
    };

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;


    return (
        <div className="song-container">
            { song ? (
            <div>
                <h1 className="header">{song.title}</h1>
                <div className="song-info">
                    <div className="like-button-container">
                        <LikeButton isLiked={song.liked} onToggle={handleLikeToggle}/>
                        {likeMessage && <Message className={`like-info-message ${likeMessage ? 'fade-in' : 'fade-out'}`}>{likeMessage}</Message>}
                        <div
                        className="lyrics-button"
                        style={{
                            color: lyrics ? 'white' : 'grey',  // Grey if no lyrics, white if available
                            cursor: lyrics ? 'pointer' : 'not-allowed'
                        }}
                        onClick={handleToggleView}
                        >
                            <LiaMicrophoneAltSolid />
                        </div>
                    </div>
                    <p>Artist: <Link to={`/artists/${song.artist_id}`}>{song.artist}</Link></p>
                    <p>Album: {song.album}</p>
                    {/* Conditional rendering based on viewMode */}
                    {viewMode === 'song' ? (
                            <div className="song-image-container">
                                <img src={song.cover} alt={`${song.title} cover`} className="song-cover" />
                                <PlayButton className="image-button" isPlaying={false} onToggle={() => {
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
                                }} />
                            </div>
                        ) : (
                            <div className="lyrics-container">
                                <h3>{lyrics}</h3>
                            </div>
                        )}
                    {message && <Message className="info-message">{message}</Message>}
                </div>
            </div>
            ) : (
                <Message className="info-message">Song not found.</Message>
            )}
        </div>
    )
}

export default SongPage;
