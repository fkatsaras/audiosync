import React from "react";
import PlayButton from "../Buttons/PlayButton";
import './AudioPlayer.css';
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useAudioPlayer } from "../../context/AudioPlayerContext";

const AudioPlayer: React.FC = () => {
    const {
        currentSong,
        isPlaying,
        togglePlayPause,
        audioRef
    } = useAudioPlayer();

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

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
                <span>{formatTime(audioRef.current?.currentTime || 0)} / {formatTime(audioRef.current?.duration || 0)}</span>
                <input
                    type="range"
                    min="0"
                    max={audioRef.current?.duration?.toString() || "0"}
                    step="0.1"
                    value={audioRef.current?.currentTime || 0}
                    onChange={(e) => {
                        if (audioRef.current) {
                            audioRef.current.currentTime = parseFloat(e.target.value);
                        }
                    }}
                />
            </div>
            <div className="controls">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={audioRef.current?.volume || 1}
                    onChange={(e) => {
                        if (audioRef.current) {
                            audioRef.current.volume = parseFloat(e.target.value);
                        }
                    }}
                />
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
            </div>
        </div>
    );
};

export default AudioPlayer;
