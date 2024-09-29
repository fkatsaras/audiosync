import React, { useState } from "react";

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
            const response = await fetch(`/search/${searchType}?q=${query}`, {
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
            setResults(data.data[searchType]);
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
                        <li key={index}>{result.title || result.name}</li>  /* Use 'title' for songs and 'name' for artists */
                    ))
                }
                {/* Render "No results found" if search was performed but no results were found */}
                {hasSearched && results.length === 0 && !loading && <li>No results found</li>}
            </ul>
        </div>
    );
}

export default Search;