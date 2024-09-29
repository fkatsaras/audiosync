import React, { useState } from "react";

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchType: 'artists' | 'songs') => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/search/${searchType}?q=${query}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data = await response.json();
            setResults(data[searchType]);
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

            {loading && <div>Loading</div>}
            {error && <div>{error}</div>}

            <ul>
                {results.map((result, index) => (           // Display the results here 
                    <li key={index}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Search;