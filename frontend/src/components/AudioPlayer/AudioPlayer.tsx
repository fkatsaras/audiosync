import React, { useEffect, useState } from "react";
import PlayButton from "../Buttons/PlayButton";
import './AudioPlayer.css';
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

const AudioPlayer: React.FC = () => {
    const {
        currentSong,
        isPlaying,
        togglePlayPause,
        currentTime,
        duration,
        volume,
        setSeek,
        setVolume,
        audioRef
    } = useAudioPlayer();

    const [progress, setProgress] = useState(0);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // Dynamic update of progress bar
    useEffect(() => {
        if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            setProgress(progressPercent);
        }
    }, [currentTime, duration]);  
    
    // Handle volume change
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
    }

    return (
        <div className="audio-player">
            <div className="audio-info">
                {/* Visualizer bars */}
                <div className={`visualizer ${isPlaying ? "active" : ""}`}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <h4>{currentSong?.title || "Unknown Title"}</h4>
                <p>{currentSong?.artist || "Unknown Artist"}</p>
            </div>
            <div className="playback">
                <PlayButton isPlaying={isPlaying} onToggle={togglePlayPause} />
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={(e) => setSeek(parseFloat(e.target.value))}
                    style={{
                        background: `linear-gradient(to right, #ffffff ${progress}%, #2a2a2a ${progress}%)`
                    }}
                />
            </div>
            <div className="controls">
                <div
                    className="volume-icon"
                    onClick={() => {
                        if (audioRef.current) {
                            audioRef.current.muted = !audioRef.current.muted;
                        }
                    }}
                >
                    {audioRef.current?.muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioRef.current?.volume || 1}
                    onChange={handleVolumeChange}
                    style={{
                        background: `linear-gradient(to right, #ffffff ${volume * 100}%, #2a2a2a ${volume * 100}%)`
                    }}
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
