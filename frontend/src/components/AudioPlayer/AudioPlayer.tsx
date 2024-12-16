import React, { useRef, useState } from "react";
import './AudioPlayer.css';

interface AudioPlayerProps {
    src: string;
    title?: string;
    artist?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title, artist }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio
                .play()
                .catch((error) => {
                    console.error("Error playing audio:", error);
                });
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;

        const seekTime = parseFloat(event.target.value);
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        const newVol = parseFloat(event.target.value);
        setVolume(newVol);
        if (audio) {
            audio.volume = newVol;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            <div className="audio-info">
                <h4>{title || "Unknown Title"}</h4>
                <p>{artist || "Unknown Artist"}</p>
            </div>
            <div className="controls">
                <button onClick={togglePlayPause}>
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration.toString()}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
