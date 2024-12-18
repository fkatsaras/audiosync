import React from 'react';
import { FaUserPlus, FaUserCheck } from 'react-icons/fa';
import './FollowButton.css';

interface FollowButtonProps{
    isFollowing: boolean;
    onToggle: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, onToggle }) => {
    return (
        <button className={`follow-button ${isFollowing ? 'following' : ''}`} onClick={onToggle}>
            <span className={`icon ${isFollowing ? 'following' : ''}`}>
                {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
            </span>
        </button>
    )
};

export default FollowButton;