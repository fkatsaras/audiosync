import React from 'react';
import './Message.css'

interface InfoMessageProps {
    children: React.ReactNode;
    className?: 'info-message' | 'success-message' | 'error-message' | string;
}

const Message: React.FC<InfoMessageProps> = ({ children, className}) => {
    const icon = className === 'info-message' ? 'i' : '!';
    return (
        <div className={`message-container ${className}`}>
            <div className='message-icon'>{icon}</div>
            <p className='message-text'>{children}</p>
        </div>
    );
};

export default Message;