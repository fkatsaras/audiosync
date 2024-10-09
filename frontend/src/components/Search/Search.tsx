import React, { useState } from "react";
import { Link } from "react-router-dom";

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (searchType: 'artists' | 'songs') => {
        setLoading(true);
        setError(null);
        setResults([]);
        setHasSearched(true);   // Mark that a search has been submitted

        try {
            const response = await fetch(`api/v1/search/${searchType}?q=${query}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 404) {
                setHasSearched(true);  // Mark that search was performed but nothing was found
                setResults([]);  // Clear results if no items were found
                return;
            }

            if(!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();

            if (searchType === 'artists') {
                setResults(data.body.artists);  // Access the list of artist JSONs received from the backend
            } else if ( searchType === 'songs') {
                setResults(data.body.songs);
            }
            setHasSearched(true);
        } catch (err) {
            console.error(err);
            setError('Something went wrong with the search');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Search</h1>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for artists or songs..."
            />
            <button onClick={() => handleSearch('artists')}>Search Artists</button>
            <button onClick={() => handleSearch('songs')}>Search Songs</button>

            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}

            <ul>
                {/* Render search results if there are any */}
                {results.length > 0 &&
                    results.map((result, index) => (
                        <li key={index}>
                            {/* Artist Search results*/}
                            {result.name && (
                                <div>
                                    {result.profile_picture && 
                                    <img 
                                        src={result.profile_picture}
                                        alt="pfp"
                                        style={{ width: '50px', height: '50px', marginRight: '10px'  }}
                                    />
                                    }
                                    <h3><Link to={`/artists/${result.id}`}>{result.name}</Link></h3>
                                </div>
                            )}
                            {/* Song Search results*/}
                            {result.title && (
                                <div>
                                    {result.album && 
                                    <img 
                                        src={result.album}
                                        alt="album"
                                        style={{ width: '50px', height: '50px', marginRight: '10px'}}
                                    />
                                    }
                                    <h3><Link to={`/songs/${result.id}`}>{result.title}</Link></h3>
                                    {result.duration}
                                </div>
                            )}
                        </li>
                    ))
                }
                {/* Render "No results found" if search was performed but no results were found */}
                {hasSearched && results.length === 0 && !loading && <li>No results found</li>}
            </ul>
        </div>
    );
}

export default Search;