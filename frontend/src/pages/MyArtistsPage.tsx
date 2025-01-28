import React, { useState, useEffect } from 'react';
import { Artist } from '../types/data'; 
import Message from '../components/Message/Message';
import LoadingDots from '../components/LoadingDots/LoadingDots';
import ResultItem from '../components/ResultItem/ResultItem';
import { useUser } from '../context/UserContext';


/**
 * MyArtistsPage component allows users to view their followed artists.
 * It fetches the artists from the backend and displays them.
 * 
 * @component
 * @returns {JSX.Element} The MyArtistsPage component UI.
 */
const  MyArtistsPage: React.FC = () => {
    const user = useUser();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    // State for managing rendering / loading of the components
        const [loadedItems, setLoadedItems] = useState<{ [key: string] : boolean }>({});
    
        useEffect(() => {
            // Mark all loaded artists and songs as "loaded" after fetch
            setTimeout(() => {
                setLoadedItems((prev) => ({
                    ...prev,
                    ...artists.reduce((acc, artist) => ({ ...acc, [artist.id]: true }), {}),
                }));
            }, 100);  // Small delay for smoothness
        }, [artists]);
    

    useEffect(() => {
        const fetchArtists = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/v1/users/${user?.userId}/artists`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status} : ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.body) {
                    setLoading(false);
                    return;
                }

                setArtists(data.body);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchArtists();
    }, [user?.userId])

    if (loading) return <LoadingDots />;

    return (
        <div>
            <h1>Your Artists</h1>
            {loading && <LoadingDots />}
            {error && <Message className='error-message'>{error}</Message>}
            <ul>
                {artists.length > 0 ? (
                    artists.map((artist) => (
                        <li key={artist.id}>
                            <ResultItem
                                id={artist.id}
                                imageSrc={artist.profile_picture}
                                title={artist.name}
                                subtitle=''
                                linkPath={`/artists`}
                                altText='Artist Profile Picture'
                                className={`artist-result ${loadedItems[artist.id] ? 'loaded' : ''}`}
                                isLoading={loading}
                            />
                        </li>
                    ))
                ) : (
                    !loading && <Message className='info-message'>No followed artists.</Message>
                )}
            </ul>
        </div>
    );
};

export default MyArtistsPage;