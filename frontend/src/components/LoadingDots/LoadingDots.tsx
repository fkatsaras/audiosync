import React from 'react';
import './LoadingDots.css';

interface LoadingDotsProps {
    message?: string;   // Optional prop for custom messages
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ message }) => {
    return (
        <div className='loading-container'>
            <div className='loading-dot'></div>
            <div className='loading-dot'></div>
            <div className='loading-dot'></div>
            {message && <p className='loading-message'>{message}</p>}
        </div>
    );
};

export default LoadingDots;