import React, { useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";
import { Artist } from "../types/types";
import HomeButton from "../components/Home/HomeButton";

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <HomeButton />
            {artist && (
                <div>
                <h1>{artist?.name}</h1>
                <img src={artist?.profile_picture} alt={`${artist?.name} profile`} />
                <p>Followers: {artist?.followers}</p>
                <button onClick={handleFollowToggle}>
                    {artist.is_followed? 'Unfollow' : 'Follow'}
                </button>
                {/*
                 Display unfollow/follow/error message here
                 !TODO! Add timeout logic so that the follow message isnt permanent
                 */}
                {message && <p>{message}</p>}
    
                <h2>Songs</h2>
                <ul>
                    {artist?.songs.map((song) => (
                        <li key={song.id}>
                            {/* Navigate to ta songs page using Link */}
                            <Link to={`/songs/${song.id}`}>
                                {song.title}
                            </Link>
                             - {song.duration}
                        </li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    )
}

export default ArtistPage;