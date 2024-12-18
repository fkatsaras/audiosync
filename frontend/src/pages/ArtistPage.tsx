import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Artist } from "../types/data";
import '../styles/ArtistPage.css'
import Button from "../components/Buttons/Button";
import AppBody from "../components/AppBody/AppBody";
import ResultItem from "../components/ResultItem/ResultItem";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import Navbar from "../components/Navbar/Navbar";
import FollowButton from "../components/Buttons/FollowButton";
import Message from "../components/Message/Message";

interface UserSessionProps {
    userId?: string;
    username?: string;
}

const ArtistPage: React.FC<UserSessionProps> = ({ userId, username }) => {
    const { artistId } = useParams<{ artistId: string }>(); // Get artist ID from URL params
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the artists details from the backend
        const fetchArtist = async () => {
            try {
                const response = await fetch(`/api/v1/artists/${artistId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setArtist(data.body);
                } else {
                    setError('Artist not found');
                }
            } catch (error) {
                setError(`Error fetching artist data: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchArtist();
    }, [artistId]);

    const handleFollowToggle = async () => {
        if (!artist) return;

        const action = artist.is_followed? 'DELETE' : 'POST';
        const endpoint = `/api/v1/users/${userId}/artists?artistId=${artistId}`;

        const response = await fetch(endpoint, {
            method: action,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setArtist(prevArtist => ({
                ...prevArtist!,
                is_followed: data.body.is_followed, // Update the artists followed status
                followers: data.body.is_followed? prevArtist!.followers + 1 : prevArtist!.followers - 1,
            }));
            setMessage(data.message);
        } else {
            const errorData = await response.json();
            setMessage(errorData.message);
        }
    };

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;

    return (
        <AppBody>
            <Navbar userId={userId || ''} username={username || ''} />
            <div className="artist-container">
                {artist && (
                    <div className="artist-content-container">
                        <div className="artist-info">
                            <h1>{artist.name}</h1>
                            <FollowButton isFollowing={artist.is_followed} onToggle={handleFollowToggle}/>
                            <p>Followers: {artist.followers}</p>
                            <img
                                src={artist.profile_picture}
                                alt={`${artist.name} profile`}
                                className="artist-profile-picture"
                            />
                            {/* Display follow/unfollow/error message */}
                            {message && <Message className="info-message">{message}</Message>}
                        </div>

                        <div className="artist-songs">
                            <h2>Songs</h2>
                            <ul>
                                {artist.songs.map((song) => (
                                    <ResultItem
                                        key={song.id}
                                        id={song.id}
                                        imageSrc={song.cover}
                                        title={song.title}
                                        subtitle={String(song.duration)} // Duration as subtitle
                                        linkPath="/songs" // Path to song page
                                        altText={`${song.title} cover`}
                                        className="song-result-image" // Use the song class for styling
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </AppBody>
    )
}

export default ArtistPage;