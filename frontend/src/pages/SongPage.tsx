import React , { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Song } from "../types/data";
import AppBody from "../components/AppBody/AppBody";
// import Button from "../components/Buttons/Button";
import Message from "../components/Message/Message";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import Navbar from "../components/Navbar/Navbar";
import LikeButton from "../components/Buttons/LikeButton";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";
import '../styles/SongPage.css'
import ProfileBar from "../components/ProfileBar/ProfileBar";

interface UserSessionProps {
    userId?: string;
    username?: string;
}

const SongPage: React.FC<UserSessionProps> = ({ userId, username }) => {
    const { songId } = useParams<{ songId: string }>(); // Get song ID from URL parameters
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    // const [audioUrl, setAudioUrl] = useState<string | null>(null);

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
                    console.log(data.body.audio_url);
                    // setAudioUrl(data.body.audio_url);
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

    // const handlePlay = () => {
    //     if (audioUrl) {
    //         const audio = new Audio(audioUrl);
    //         audio.play().catch(error => {
    //             console.error(`Error playing audio: ${error}`);
    //             setMessage('Unable to play audio.');
    //         });
    //     } else {
    //         setMessage('Audio URL unavailable');
    //     }
    // }

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;

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
                            <p>Duration: {song.duration} seconds</p>
                            <img src={song.cover} alt={`${song.title} cover`} className="song-cover"/>
                            {/* Additional song info here*/}
                            {/*
                             Display unfollow/follow/error message here
                             !TODO! Add timeout logic so that the follow message isnt permanent
                             */}
                            {/* <Button isSpecial={false} onClick={handlePlay}>
                                Play Audio
                            </Button> */}
                            <AudioPlayer
                                src={song.audio_url}
                                title={song.title}
                                artist={song.artist}
                                />
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
