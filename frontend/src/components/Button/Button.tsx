import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode; // Render button text or icons
    className?: string; // Optional classname attr
    type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '', //Default to empty incase no name is provided
    type = 'button', // Default to button
    ...props    // Spread additional props that will be given in some cases
}) => {
    return (
        <button type={type} className={`default-button ${className}`} {...props}> 
            {children}
        </button>   // for custom styles
    );
};

export default Button;