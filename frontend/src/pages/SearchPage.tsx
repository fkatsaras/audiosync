import React, { useEffect, useState } from 'react';
import { Song, Artist } from '../types/data';
import '../styles/SearchPage.css'
import LoadingDots from '../components/LoadingDots/LoadingDots';
import Button from '../components/Buttons/Button';
import Input from '../components/Input/Input';
import Message from '../components/Message/Message';
import ResultItem from '../components/ResultItem/ResultItem';
import { useLocation, useNavigate } from 'react-router-dom';


/**
 * Search component allows users to search for artists and songs by entering a query.
 * It fetches the search results from the backend and displays them, with options to load more results.
 * 
 * @component
 * @returns {JSX.Element} The Search component UI.
 */
const Search: React.FC = () => {
    const location = useLocation();
    const [query, setQuery] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('q') || '';
        const type = (params.get('type') as 'artists' | 'songs') || 'artists';

        setQuery(searchQuery);
        setSearchType(type);
        if (searchQuery) {
            // You can call your fetchResults function here based on searchType
            handleSearch(type);
        }
    }, [location]);


    const [artistResults, setArtistResults] = useState<Artist[]>([]);
    const [songResults, setSongResults] = useState<Song[]>([]);
    const [artistOffset, setArtistOffset] = useState<number>(0);
    const [songOffset, setSongOffset] = useState<number>(0);
    const [topResult, setTopResult] = useState<Artist |Song | null>(null);
    const [loadingResults, setLoadingResults] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasMoreArtists, setHasMoreArtists] = useState<boolean>(false);
    const [hasMoreSongs, setHasMoreSongs] = useState<boolean>(true);      // Tracks if there are more song results
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    // State for managing rendering / loading of the components
    const [loadedItems, setLoadedItems] = useState<{ [key: string] : boolean }>({});

    useEffect(() => {
        // Mark all loaded artists and songs as "loaded" after fetch
        setTimeout(() => {
            setLoadedItems((prev) => ({
                ...prev,
                ...artistResults.reduce((acc, artist) => ({ ...acc, [artist.id]: true }), {}),
                ...songResults.reduce((acc, song) => ({ ...acc, [song.id]: true }), {}),
                ...(topResult ? { [topResult.id]: true } : {})  // Add top result if available
            }));
        }, 100);  // Small delay
    }, [artistResults, songResults, topResult]);


    /**
    * Fetches search results from the backend API for the given type (artists or songs) and offset.
    * 
    * @async
    * @function fetchResults
    * @param {'artists' | 'songs'} type - The type of results to fetch (artists or songs).
    * @param {number} offset - The number of results to skip, for pagination purposes.
    * @returns {Promise<void>} Updates the state with fetched results and handles loading/error states.
    * 
    */
    const fetchResults = async (type: 'artists' | 'songs', offset: number) => {
        setLoadingResults(true);
        try {
            const response = await fetch(`/api/v1/search/${type}${query ? `?q=${query}&offset=${offset}&limit=5` : ''}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Error fetching results');

            // Check if data.body is null
            if (!data.body) {
                if (type === 'artists') {
                    setHasMoreArtists(false);
                } else {
                    setHasMoreSongs(false);
                }
                setLoadingResults(false);
                setHasSearched(true);
                return;
            }

            // Extract top result
            const fetchedResults = type === 'artists' ? data.body.artists : data.body.songs;

            if (fetchedResults.length > 0 && offset === 0) {
                setTopResult(fetchedResults[0]);
                fetchedResults.shift();
            }
    
            if (type === 'artists') {
                setArtistResults((prevResults) => [...prevResults, ...fetchedResults]);
    
                if (fetchedResults.length < 4) {
                    setHasMoreArtists(false);
                }
            } else {
                setSongResults((prevResults) => [...prevResults, ...fetchedResults]);
    
                if (fetchedResults.length < 4) {
                    setHasMoreSongs(false);
                }
            }
    
            setHasSearched(true);
        } catch (err) {
            (err instanceof Error) ? 
                setError(err.message || 'Failed to fetch results.') : setError('An unknown error occurred.')
        } finally {
            setLoadingResults(false);
        }

    };


    /**
    * Handles search button clicks by clearing previous results and fetching new results.
    * 
    * @function handleSearch
    * @param {'artists' | 'songs'} type - The type of results to search for (artists or songs).
    */
    const handleSearch = (type: 'artists' | 'songs') => {
        setError('');
        setArtistResults([]);
        setSongResults([]);
        setTopResult(null);
        setArtistOffset(0);
        setSongOffset(0);
        setHasMoreArtists(true);
        setHasMoreSongs(true);
        setSearchType(type);

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
                <h1 className='header'>Search</h1>

                {/* Top result */}
                {topResult && (
                        <div className='top-result-container'>
                            <h2>Top Result</h2>
                            <ResultItem
                                id={topResult.id}
                                imageSrc={'cover' in topResult ? topResult.cover : topResult.profile_picture}
                                title={'title' in topResult ? topResult.title : topResult.name}
                                subtitle={'duration' in topResult ? String(topResult.duration) : ''}
                                linkPath={searchType === 'songs' ? '/songs' : '/artists' }
                                altText='Top Result'
                                className={`top-result ${loadedItems[topResult.id] ? 'loaded' : ''}`}
                                isLoading={loadingResults}
                            />
                        </div>
                    )}
                
                <ul className='result-list'>
                    
                    {/*Artists results*/}
                    {artistResults.length > 0 && artistResults.map((artist, index) => (
                        <li key={artist.id}>
                            <ResultItem 
                                id={artist.id}
                                imageSrc={artist.profile_picture}
                                title={artist.name}
                                subtitle=''
                                linkPath='/artists'
                                altText='Artist profile'
                                className={`artist-result ${loadedItems[artist.id] ? 'loaded' : ''}`}
                                isLoading={loadingResults}
                            />
                        </li>
                    ))}

                    {/* Song results*/}
                    {songResults.length > 0 && songResults.map((song, index) => (
                        <li key={song.id}>
                            <ResultItem 
                                id={song.id}
                                imageSrc={song.cover}
                                title={song.title}
                                subtitle={String(song.duration)}
                                linkPath='/songs'
                                altText='Song cover'
                                className={`song-result ${loadedItems[song.id] ? 'loaded' : ''}`}
                                isLoading={loadingResults}
                            />
                        </li>
                    ))}
                    {loadingResults && <LoadingDots />}
                    {error && <Message className='error-message'>{error}</Message>}

                    {/* Show more */}
                    {hasMoreArtists && !loadingResults && artistResults.length > 0 && (
                        <Button onClick={() => handleShowMore('artists')} className='show-more-button'>Show More</Button>
                    )}

                    {/* Show more songs */}
                    {hasMoreSongs && !loadingResults && songResults.length > 0 && (
                        <Button onClick={() => handleShowMore('songs')} className='show-more-button'>Show More</Button>
                    )}
                </ul>
                
                {/* In case no results match the query*/}
                {hasSearched && !topResult && artistResults.length === 0 && songResults.length === 0 && !loadingResults && (
                <Message className='info-message'>No results found</Message>
                )}
        </div>
    );
};


export default Search;