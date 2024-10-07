import React, { useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";

// Define types for song data
interface Song {                //!TODO! export all the interfaces from a single file to avoid duplicate code
    id: number;
    title: string;
    duration: string;
};

// Define types for artist data
interface Artist {
    id: number,
    name: string,
    songs: Song[],
    followers: number,
    is_followed: boolean,
    profile_picture: string
};

const ArtistPage: React.FC = () => {
    const { artistId } = useParams<{ artistId: string }>(); // Get artist ID from URL params
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {artist && (
                <div>
                <h1>{artist?.name}</h1>
                <img src={artist?.profile_picture} alt={`${artist?.name} profile`} />
                <p>Followers: {artist?.followers}</p>
                <p>{artist?.is_followed ? "Following" : "Not Following"}</p>
    
                <h2>Songs</h2>
                <ul>
                    {artist?.songs.map((song) => (
                        <li key={song.id}>
                            {/* Navigate to ta songs page using Link */}
                            < Link to={`/songs/${song.id}`}>
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