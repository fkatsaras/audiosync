import React from "react";
import { FaCheck } from "react-icons/fa";
import './LikeButton.css';

interface LikeButtonProps {
    isLiked: boolean;
    onToggle: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ isLiked, onToggle }) => {
    return (
        <button className={`like-button ${isLiked ? "liked" : ""}`} onClick={onToggle}>
                <span className={`tick ${isLiked ? 'liked' : ''}`}><FaCheck /></span>
        </button>
    )
}

export default LikeButton;