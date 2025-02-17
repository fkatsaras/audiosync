import React, { useState } from "react";
import { PiShuffle } from "react-icons/pi";
import './ShuffleButton.css';

interface ShuffleButtonProps {
    className?: string;
    onClick: () => void;
}

const ShuffleButton: React.FC<ShuffleButtonProps> = ({ className, onClick }) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const handleClick = () => {
        setIsClicked(true);
        onClick();

        // For CSS styling
        setTimeout(() => {
            setIsClicked(false);
        }, 50);
    }
    return (
        <button
            className={`${className ? className : ''} ${isClicked ? 'clicked' : ''}`}
            onClick={handleClick}
        >
            <PiShuffle />
        </button>
    );
};

export default ShuffleButton;

