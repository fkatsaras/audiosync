import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Song, Artist } from '../types/dataTypes';
import Navbar from '../components/Navbar/Navbar';
import '../styles/SearchPage.css'
import AppBody from '../components/AppBody/AppBody';

/**
 * Search component allows users to search for artists and songs by entering a query.
 * It fetches the search results from the backend and displays them, with options to load more results.
 * 
 * @component
 * @returns {JSX.Element} The Search component UI.
 */
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

    /**
    * Fetches search results from the backend API for the given type (artists or songs) and offset.
    * 
    * @async
    * @function fetchResults
    * @param {'artists' | 'songs'} type - The type of results to fetch (artists or songs).
    * @param {number} offset - The number of results to skip, for pagination purposes.
    * @returns {Promise<void>} Updates the state with fetched results and handles loading/error states.
    */
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


    /**
    * Handles search button clicks by clearing previous results and fetching new results.
    * 
    * @function handleSearch
    * @param {'artists' | 'songs'} type - The type of results to search for (artists or songs).
    */
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

    /**
    * Fetches more results when the user clicks "Show More" for either artists or songs.
    * 
    * @function handleShowMore
    * @param {'artists' | 'songs'} type - The type of results to fetch more of (artists or songs).
    */
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
        <div className='search-container'>
            <Navbar />
            <AppBody>
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
                                    className='artist-image'
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
                                    className='song-image'
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
            </AppBody>
        </div>
    );
};


export default Search;