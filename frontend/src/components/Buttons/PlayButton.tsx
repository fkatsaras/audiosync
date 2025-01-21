import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import './PlayButton.css';

interface PlayButtonProps {
    isPlaying: boolean;
    onToggle: () => void;
    className?: string;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onToggle, className }) => {
    return (
        <button
            className={`play-button ${className? className : ""} ${isPlaying? "playing" : ""}`}
            onClick={onToggle}
        >
            <span className="icon">
                {isPlaying ? <FaPause /> : <FaPlay />}
            </span>
        </button>
    );
};

export default PlayButton;