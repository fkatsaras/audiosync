import React, { useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";
import { Artist } from "../types/data";
import '../styles/ArtistPage.css'
import Button from "../components/Buttons/Button";
import AppBody from "../components/AppBody/AppBody";
import ResultItem from "../components/ResultItem/ResultItem";
import LoadingDots from "../components/LoadingDots/LoadingDots";


const ArtistPage: React.FC = () => {
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
        if (artist) {

            const response = await fetch(`/api/v1/artists/${artistId}/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-type': 'application/json', 
                },
            });

            if (response.ok) {
                const data = await response.json();
                setArtist(prevArtist => ({
                    ...prevArtist!,
                    is_followed: data.body.is_followed,
                    followers: data.body.is_followed? prevArtist!.followers + 1 : prevArtist!.followers - 1,
                }))
                setMessage(data.message);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
            }
        }
    };

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;

    return (
        <AppBody>
            <div className="artist-container">
                <Button><Link to='/'>Home</Link></Button>   {/* TODO: Integrate the link component inside the button component*/}
                {artist && (
                    <div className="artist-content-container">
                        <div className="artist-info">
                            <h1>{artist.name}</h1>
                            <img
                                src={artist.profile_picture}
                                alt={`${artist.name} profile`}
                                className="artist-profile-picture"
                            />
                            <p>Followers: {artist.followers}</p>
                            <Button isSpecial={true} isActive={artist.is_followed} onClick={handleFollowToggle}>
                                {artist.is_followed ? 'Following' : 'Follow'}
                            </Button>

                            {/* Display follow/unfollow/error message */}
                            {message && <p>{message}</p>}
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