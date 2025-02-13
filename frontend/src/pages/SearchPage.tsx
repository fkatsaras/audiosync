import React, { useCallback, useEffect, useState } from 'react';
import { Song, Artist } from '../types/data';
import '../styles/SearchPage.css'
import LoadingDots from '../components/LoadingDots/LoadingDots';
import Button from '../components/Buttons/Button';
import Message from '../components/Message/Message';
import ResultItem from '../components/ResultItem/ResultItem';
import { useLocation } from 'react-router-dom';


const Search: React.FC = () => {
    const location = useLocation();
    const [query, setQuery] = useState<string>('');
    const [filter, setFilter] = useState<'artists' | 'songs' | 'all'>('all');
    const [searching, setSearching] = useState<boolean>(false);
    const [results, setResults] = useState<{ artists: Artist[], songs: Song[] }>({ artists: [], songs: [] });
    const [offsets, setOffsets] = useState<{ artists: number, songs: number }>({ artists: 0, songs: 0 });
    const [topResult, setTopResult] = useState<Artist | Song | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasMore, setHasMore] = useState<{ artists: boolean, songs: boolean }>({ artists: false, songs: false });
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [loadedResults, setLoadedResults] = useState<{ [key: string] : boolean }>({});


    const fetchResults = useCallback(async (type: 'artists' | 'songs', offset: number, limit: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/search/${type}?q=${query}&offset=${offset}&limit=${limit}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error fetching results');

            if (!data.body || data.body[type].length === 0) {
                setHasMore(prev => ({ ...prev, [type]: false }));
                return;
            }

            const fetchedResults = data.body[type];
            if (offset === 0) {
                setTopResult(fetchedResults.shift() || null);   // TODO: need to be set not just for artists
            }

            setResults(prev => ({ ...prev, [type]: [...prev[type], ...fetchedResults] }));  // Append the fetched results into the existing results
            setHasMore(prev => ({ ...prev, [type]: fetchedResults.length >= limit }));
        } catch (error: any) {
            setError(error.message || 'Failed to fetch results');
        } finally {
            setLoading(false);
            setHasSearched(true);
        }
    },[query]);

    /**
     * Main entry point of searching
     * 
     */
    const handleSearch = (type: 'artists' | 'songs' | 'all') => {
        setSearching(true);
        setError('');
        setResults({ artists: [], songs: [] });
        setTopResult(null);
        setOffsets({ artists: 0, songs: 0 });
        setHasMore({ artists: true, songs: true });

        if (type === 'all') {
            setFilter('all');
            fetchResults('artists', 0, 5);
            fetchResults('songs', 0, 5);
        } else {
            setFilter(type);
            fetchResults(type, 0, 15);
        }
        setSearching(false);
    };

    const handleShowMore = (type: 'artists' | 'songs') => {
        setOffsets(prev => {
            const newOffset = prev[type] + 5;
            fetchResults(type, newOffset, 15);
            return { ...prev, [type]: newOffset }
        })
    }
    // Navigation re render
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('q') || '';
        setQuery(searchQuery);

    }, [location.search])

    // Query setup re render
    useEffect(() => {
        if (query) {
            handleSearch('all');
        }
    }, [query]);

    // Mark results as loaded after fetch
    useEffect(() => {
        setTimeout(() => {
            setLoadedResults((prev) => ({
                ...prev,
                ...results.songs.reduce((acc, song) => ({ ...acc, [song.id]: true }), {}),
                ...results.artists.reduce((acc, artist) => ({ ...acc, [artist.id]: true }), {}),
                ...(topResult ? { [topResult.id]: true } : {})
            }));
        }, 100);    // Small delay
    }, [results, topResult]);
    

    return (
        <div className='search-container'>
                <h1 className='header'>Search</h1>
                <div className="filter-buttons-container">
                    <Button
                        className='filter-button'
                        onClick={() => {
                            handleSearch('all')
                        }}
                    >
                        All
                    </Button>
                    <Button
                        className='filter-button'
                        onClick={() => {
                            handleSearch('artists')
                        }}
                    >
                        Artists
                    </Button>
                    <Button
                        className='filter-button'
                        onClick={() => {
                            handleSearch('songs');
                        }}
                    >
                        Songs
                    </Button>
                </div>

                {/* Search all view */}
                {filter === 'all' && topResult && (
                    <div className='search-all-view'>
                        <div className='top-result-container'>
                            <h2>Top Result</h2>
                            <ResultItem
                                id={topResult.id}
                                imageSrc={'cover' in topResult ? topResult.cover : topResult.profile_picture}
                                title={'title' in topResult ? topResult.title : topResult.name}
                                subtitle={'duration' in topResult ? String(topResult.duration) : ''}
                                linkPath={'duration' in topResult ? '/songs' : '/artists' }
                                altText='Top Result'
                                className={`top-result ${loadedResults[topResult.id] ? 'loaded' : ''}`}
                                isLoading={loading}
                            />
                        </div>
                        <div className='results-containers'>
                            <div className='artist-results-container'>
                                <h2>Artists</h2>
                                <ul className='artist-result-list'>
                                    {results.artists.length > 0 && results.artists.map((artist, index) => (
                                        <li key={artist.id}>
                                            <ResultItem 
                                                id={artist.id}
                                                imageSrc={artist.profile_picture}
                                                title={artist.name}
                                                subtitle=''
                                                linkPath='/artists'
                                                altText='Artist profile'
                                                className={`artist-result ${loadedResults[artist.id] ? 'loaded' : ''}`}
                                                isLoading={loading}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                               
                            <div className='song-results-container'>
                                <h2>Songs</h2>
                                <ul className='song-result-list'>
                                    {results.songs.length > 0 && results.songs.map((song, index) => (
                                        <li key={song.id}>
                                            <ResultItem 
                                                id={song.id}
                                                imageSrc={song.cover}
                                                title={song.title}
                                                subtitle={String(song.duration)}
                                                linkPath='/songs'
                                                altText='Song cover'
                                                className={`song-result ${loadedResults[song.id] ? 'loaded' : ''}`}
                                                isLoading={loading}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    )}

                    {/* Search Songs View */}
                    {filter === 'songs' &&
                        <div className='song-results-container'>
                            <h2>Songs</h2>
                            <ul className='song-result-list'>
                                {results.songs.length > 0 && results.songs.map((song, index) => (
                                    <li key={song.id}>
                                        <ResultItem 
                                            id={song.id}
                                            imageSrc={song.cover}
                                            title={song.title}
                                            subtitle={String(song.duration)}
                                            linkPath='/songs'
                                            altText='Song cover'
                                            className={`song-result ${loadedResults[song.id] ? 'loaded' : ''}`}
                                            isLoading={loading}
                                        />
                                    </li>
                                ))}
                            </ul>
                            {hasMore.songs && !loading && results.songs.length > 0 && (
                                <Button onClick={() => handleShowMore('songs')} className='show-more-button'>Show More</Button>
                            )}
                        </div>
                    }
                    {/* Search Artists View */}
                    {filter === 'artists' &&
                        <div className='artist-results-container'>
                            <h2>Artists</h2>
                            <ul className='artist-result-list'>
                                {results.artists.length > 0 && results.artists.map((artist, index) => (
                                    <li key={artist.id}>
                                        <ResultItem 
                                            id={artist.id}
                                            imageSrc={artist.profile_picture}
                                            title={artist.name}
                                            subtitle=''
                                            linkPath='/artists'
                                            altText='Artist profile'
                                            className={`artist-result ${loadedResults[artist.id] ? 'loaded' : ''}`}
                                            isLoading={loading}
                                        />
                                    </li>
                                ))}
                            </ul>
                            {hasMore.artists && !loading && results.artists.length > 0 && (
                                <Button onClick={() => handleShowMore('artists')} className='show-more-button'>Show More</Button>
                            )}
                        </div>
                    }
                
                {/* In case no results match the query*/}
                {!loading && !searching && hasSearched && results.artists.length === 0 && results.songs.length === 0 && (
                <Message className='info-message'>No results found</Message>
                )}
                {loading && <LoadingDots />}
                {error && <Message className='error-message'>{error}</Message>}
        </div>
    );
}


export default Search;