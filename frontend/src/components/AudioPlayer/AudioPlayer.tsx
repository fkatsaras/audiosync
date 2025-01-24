import React, { useCallback, useEffect, useState } from "react";
import PlayButton from "../Buttons/PlayButton";
import './AudioPlayer.css';
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import defaultSongCover from '../../assets/images/song_default_cover.svg';
import { Link } from "react-router-dom";
import { Song } from "../../types/data";

interface UserSessionProps {
    userId?: string;
    username?: string;
}

const AudioPlayer: React.FC<UserSessionProps> = ({ userId, username }) => {
    const {
        currentSong,
        setCurrentSong,
        isPlaying,
        togglePlayPause,
        currentTime,
        duration,
        volume,
        setSeek,
        setVolume,
        audioRef,
        setAudioState
    } = useAudioPlayer();

    const [isMuted, setIsMuted] = useState(false);

    // Fetch last played song
    useEffect(() => {
        const fetchLastPlayedSong = async () => {
            try {
                    // Fetch last played song from API 
                    const response = await fetch(`/api/v1/users/${userId}/history?latest=true`, {
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
    }, [userId, setCurrentSong, setAudioState]);
    
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
            await fetch(`/api/v1/users/${userId}/history`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    song_id: currentSong?.id,
                    played_at: playedAt
                })
            });
        } catch (error) {
            console.error('Failed to update history.');
        }
    }, [userId]); 
    
    useEffect(() => {
        if (currentSong && currentSong.id) {
            updateListeningHistory(currentSong);
        }
    }, [currentSong, updateListeningHistory]);
   
    return (
        <div className="audio-player">
            <div className="audio-info">
                <div className="now-playing-song-image-container">
                    <img
                        src={currentSong? currentSong.cover : defaultSongCover}
                        alt={`${currentSong? currentSong.title : "Now Playing Song"} cover`}
                        className="now-playing-song-image"
                    />
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
                <div className="volume-icon" onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
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
