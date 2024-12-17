import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import './PlayButton.css';

interface PlayButtonProps {
    isPlaying: boolean;
    onToggle: () => void;
}

const PlayButton: React.FC<PlayButtonProps> = ({ isPlaying, onToggle }) => {
    return (
        <button
            className={`play-button ${isPlaying? "playing" : ""}`}
            onClick={onToggle}
        >
            <span className="icon">
                {isPlaying ? <FaPause /> : <FaPlay />}
            </span>
        </button>
    );
};

export default PlayButton;