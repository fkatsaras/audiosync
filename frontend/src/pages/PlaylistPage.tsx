import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Playlist } from "../types/data";
import '../styles/PlaylistPage.css';
import AppBody from "../components/AppBody/AppBody";
import ResultItem from "../components/ResultItem/ResultItem";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import Button from "../components/Buttons/Button";
import defaultPlaylistCover from '../assets/images/playlist_default_cover.svg';
import defaultSongCover from '../assets/images/song_default_cover.svg';
import Navbar from "../components/Navbar/Navbar";

interface UserSessionProps {
    userId?: string;
    username?: string;
  }

const PlaylistPage: React.FC<UserSessionProps> = ({ userId, username })  => {
    const { playlistId } = useParams<{ playlistId: string }>();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`/api/v1/playlists/${playlistId}`, {
                    headers: {
                        'Authorization' : `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPlaylist(data.body);
                } else {
                    setError('Playlist not found');
                }
            } catch (error) {
                setError(`Error fetching playlist data: ${error}`);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    // const handleLikeToggle !TODO! Implement this

    if (loading) return <LoadingDots/>;
    if (error) return <div>{error}</div>;

    return (
        <AppBody>
            <Navbar userId={userId || ''} username={username || ''}/>
            <div className="playlist-container">
                <Button><Link to='/'>Home</Link></Button>
                {playlist && (
                    <div className="playlist-content-container">
                        <div className="playlist-info">
                            <h1>{playlist.title}</h1>
                            <img
                                src={playlist.cover? playlist.cover : defaultPlaylistCover}
                                alt={`${playlist.title} cover`}
                                className="playlist-cover"    
                            />
                            {/*!TODO! Implement like functionality here*/}

                        </div>
                        <div className="playlist-songs">
                            <h2>Songs</h2>
                            <ul>
                                {playlist.songs?.map((song) => (
                                    <ResultItem 
                                        key={song.id}
                                        id={song.id}
                                        imageSrc={song.cover? song.cover : defaultSongCover}
                                        title={song.title}
                                        subtitle={String(song.duration)}
                                        linkPath="/songs"
                                        altText={`${song.title} cover`}
                                        className="song-result-image"    
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </AppBody>
    )
}

export default PlaylistPage;