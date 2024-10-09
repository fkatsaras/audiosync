import React , { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Song } from "../../types/types";


const SongPage: React.FC = () => {
    const { songId } = useParams<{ songId: string }>(); // Get song ID from URL parameters
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            { song ? (
                <div>
                    <h1>{song.title}</h1>
                    <p>Artist: <Link to={`/artists/${song.artist_id}`}>{song.artist}</Link></p>
                    <p>Album: {song.album}</p>
                    <p>Duration: {song.duration} seconds</p>
                    <img src={song.cover} alt={`${song.title} cover`} />
                    {/* Additional song info here*/}
                </div>
            ) : (
                <p>Song not found.</p>
            )}
        </div>
    )
}

export default SongPage;
