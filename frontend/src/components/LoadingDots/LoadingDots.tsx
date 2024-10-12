import React from 'react';
import './LoadingDots.css';

const LoadingDots: React.FC = () => {
    return (
        <div className='loading-container'>
            <div className='loading-dot'></div>
            <div className='loading-dot'></div>
            <div className='loading-dot'></div>
        </div>
    );
};

export default LoadingDots;