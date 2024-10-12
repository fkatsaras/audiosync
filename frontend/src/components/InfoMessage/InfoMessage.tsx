import React from 'react';
import './InfoMessage.css'

interface InfoMessageProps {
    children: React.ReactNode;
}

const InfoMessage: React.FC<InfoMessageProps> = ({ children }) => {
    return (
        <div className='info-message-container'>
            <div className='info-icon'>i</div>
            <p className='info-message'>{children}</p>
        </div>
    );
};

export default InfoMessage;