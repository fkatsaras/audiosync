import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

// Define types for artista and song results 
interface Artist {
    id: number;
    name: string;
    profile_picture?: string;
}

interface Song {
    id: number;
    title: string;
    album?: string;
    duration: string;
}

const Search: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [artistResults, setArtistResults] = useState<Artist[]>([]);
    const [songResults, setSongResults] = useState<Song[]>([]);
    const [artistOffset, setArtistOffset] = useState<number>(0);
    const [songOffset, setSongOffset] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasMoreArtists, setHasMoreArtists] = useState<boolean>(false);
    const [hasMoreSongs, setHasMoreSongs] = useState<boolean>(true);      // Tracks if there are more song results
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    // Fetch results from the backend
    const fetchResults = async (type: 'artists' | 'songs', offset: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/search/${type}?q=${query}&offset=${offset}&limit=5`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            const data = await response.json();

            // Check if data.body is null
            if (!data.body) {
                if (type === 'artists') {
                    setHasMoreArtists(false);
                } else {
                    setHasMoreSongs(false);
                }
                setLoading(false);
                setHasSearched(true);
                return;
            }
    
            if (type === 'artists') {
                setArtistResults((prevResults) => [...prevResults, ...data.body.artists]);
    
                if (data.body.artists.length < 5) {
                    setHasMoreArtists(false);
                }
            } else {
                setSongResults((prevResults) => [...prevResults, ...data.body.songs]);
    
                if (data.body.songs.length < 5) {
                    setHasMoreSongs(false);
                }
            }
    
            setLoading(false);
            setHasSearched(true);
        } catch (err) {
            setError('Failed to fetch results.');
            setLoading(false);
        } finally {
            setLoading(false);
        }

    };


    // Handle the search button clicks 
    const handleSearch = (type: 'artists' | 'songs') => {
        setArtistResults([]);
        setSongResults([]);
        setArtistOffset(0);
        setSongOffset(0);
        setHasMoreArtists(true);
        setHasMoreSongs(true);

        // fetch the results
        fetchResults(type, 0);
    };

    const handleShowMore = (type: 'artists' | 'songs') => {
        if (type === 'artists') {
            const newOffset = artistOffset + 5;
            setArtistOffset(newOffset);

            // Send another request to fetch more results 
            fetchResults('artists', newOffset);
        } else {
            const newOffset = songOffset + 5;
            setSongOffset(newOffset);

            fetchResults('songs', newOffset);
        }
    };

    return (
        <div>
            <h1>Search</h1>
            <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search for artists, songs...'
            />
            <button onClick={() => handleSearch('artists')}>Search Artists</button>
            <button onClick={() => handleSearch('songs')}>Search Songs</button>

            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}

            <ul>
                {/*Artists results*/}
                {artistResults.length > 0 && artistResults.map((artist, index) => (
                    <li key={artist.id}>
                        <div>
                            {artist.profile_picture && 
                            <img 
                                src={artist.profile_picture}
                                alt='Artist profile'
                                style={{ width: '50px', height: '50px', marginRight: '10px' }}
                            />}
                            <h3><Link to={`/artists/${artist.id}`}>{artist.name}</Link></h3>
                        </div>
                    </li>
                ))}

                {/* Song results*/}
                {songResults.length > 0 && songResults.map((song, index) => (
                    <li key={song.id}>
                        <div>
                            {song.album && 
                            <img 
                                src={song.album}
                                alt='Song cover'
                                style={{ width: '50px', height: '50px', marginRight: '10px' }}
                            />}
                            <h3><Link to={`/songs/${song.id}`}>{song.title}</Link></h3>
                            {song.duration}
                        </div>
                    </li>
                ))}

                {/* Show more */}
                {hasMoreArtists && !loading && artistResults.length > 0 && (
                    <button onClick={() => handleShowMore('artists')}>Show More</button>
                )}

                {/* Show more songs */}
                {hasMoreSongs && !loading && songResults.length > 0 && (
                    <button onClick={() => handleShowMore('songs')}>Show More</button>
                )}
            </ul>
            
            {/* In case no results match the query*/}
            {hasSearched && artistResults.length === 0 && songResults.length === 0 && !loading && (
            <div>No results found</div>
            )}
        </div>
    );
};


export default Search;