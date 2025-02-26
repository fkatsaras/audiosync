import React, { useCallback, useEffect, useState } from "react";
import PlayButton from "../Buttons/PlayButton";
import './AudioPlayer.css';
import { BiVolumeFull, BiVolumeLow, BiVolumeMute } from 'react-icons/bi';
import { LiaMicrophoneAltSolid } from "react-icons/lia";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Song } from "../../types/data";
import { useUser } from "../../context/UserContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const AudioPlayer: React.FC = () => {

    const user = useUser();
    const {
        currentSong,
        setCurrentSong,
        isPlaying,
        togglePlayPause,
        lyricsAvailable,
        currentTime,
        duration,
        volume,
        setSeek,
        setVolume,
        audioRef,
        setAudioState
    } = useAudioPlayer();

    const [isMuted, setIsMuted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<"song" | "lyrics">(
        location.search.includes("view=lyrics") ? "lyrics" : "song"
    );

    // Fetch last played song
    useEffect(() => {
        const fetchLastPlayedSong = async () => {
            try {
                    // Fetch last played song from API 
                    const response = await fetch(`${API}/users/${user?.userId}/history?latest=true`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch last played song: ${response.statusText}`);
                    }

                    const data = await response.json();
                    const lastPlayedSong = data.body[0];    // Song is returned in an array

                    if (!lastPlayedSong) {
                        console.warn('No song found in history.');
                        return;
                    }

                    // setAudioState(prev => ({ ...prev, currentSong: lastPlayedSong }));
                    setCurrentSong(lastPlayedSong);
            } catch (error) {
                console.error(`Error retrieving last played song: ${error}`);
            }
        };

        fetchLastPlayedSong();
    }, [user?.userId, setCurrentSong, setAudioState]);
    
    // Progress percentage
    const progress = duration ? (currentTime / duration) * 100 : 0;

    // Handle mute toggle
    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(audioRef.current.muted);
        }
    };

    // Format time helper
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const updateListeningHistory = useCallback(async (currentSong: Song) => {
        try {
            const playedAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'
            await fetch(`${API}/users/${user?.userId}/history`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user?.userId,
                    song_id: currentSong?.id,
                    played_at: playedAt
                })
            });
        } catch (error) {
            console.error('Failed to update history.');
        }
    }, [user?.userId]); 
    
    useEffect(() => {
        if (currentSong && currentSong.id) {
            updateListeningHistory(currentSong);
        }
    }, [currentSong, updateListeningHistory]);

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) {
            return <BiVolumeMute />;
        } else if (volume < 0.5) {
            return <BiVolumeLow />;
        } else {
            return <BiVolumeFull />;
        }
    }
    // Navigation function for lyrics page
    const toggleLyrics = useCallback((songId: number | null) => {
        if (!currentSong) return;
        const lyricsPath = `/songs/${songId}?view=lyrics`;
        const songPath = `/songs/${songId}?view=song`
        const newViewMode = viewMode === "lyrics" ? "song" : "lyrics";
        setViewMode(newViewMode);
                
        navigate(location.search.includes("view=lyrics") ? songPath : lyricsPath);
    }, [navigate, viewMode, location, lyricsAvailable]);
    
    useEffect(() => {
        // Reset viewMode if navigating away from this song
        if (!location.search.includes("view=lyrics")) {
            setViewMode("song");
        }
    }, [location.search]);

   
    return (
        <div className="audio-player">
            <div className="audio-info">
                <div className="now-playing-song-image-container">
                    {currentSong ? (
                        <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className="now-playing-song-image"
                    />
                    ) : (
                        <div className="now-playing-song-image-placeholder"></div>
                    )}
                </div>
                <div className="now-playing-info">
                    {/* Visualizer bars */}
                    <div className={`visualizer ${isPlaying ? "active" : ""}`}>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </div>
                    <h4>{currentSong? <Link to={`/songs/${currentSong.id}`}>{currentSong.title}</Link> : "Now Playing Song"}</h4>
                    <p>{currentSong? <Link to={`/artists/${currentSong.artist_id}`}>{currentSong.artist}</Link> : "Now Playing Artist"}</p>
                </div>
            </div>
            <div className="playback-container">
                <div className="current-time">{formatTime(currentTime)}</div>
                <div className="playback">
                    <PlayButton isPlaying={isPlaying} onToggle={togglePlayPause} />
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={currentTime}
                        onChange={(e) => setSeek(Number(e.target.value))}
                        style={{
                            background: `linear-gradient(to right, #ffffff ${progress}%, #2a2a2a ${progress}%)`
                        }}
                    />
                </div>
                <div className="duration">{formatTime(duration)}</div>
            </div>
            <div className="controls">
                <div
                className="lyrics-button"
                style={{
                    color: viewMode === "lyrics" ? "#6a1b9a" : lyricsAvailable ? 'white' : 'grey',
                    cursor: lyricsAvailable ? 'pointer' : 'not-allowed',
                    position: "relative"
                }}
                onClick={() => { if (currentSong) toggleLyrics(currentSong.id); }}
                >
                    <LiaMicrophoneAltSolid />
                    {viewMode === "lyrics" && (
                        <span className="lyrics-indicator"></span>
                    )}
                </div>
                <div className="volume-icon" onClick={toggleMute}>
                    {getVolumeIcon()}
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioRef.current?.volume || 1}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    style={{
                        background: `linear-gradient(to right, #ffffff ${volume * 100}%, #2a2a2a ${volume * 100}%)`
                    }}
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
