import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode; // Render button text or icons
    className?: string; // Optional classname attr
    type?: 'button' | 'submit' | 'reset';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '', //Default to empty incase no name is provided
    type = 'button', // Default to button
    onClick,
    ...props    // Spread additional props that will be given in some cases
}) => {
    return (
        <button type={type} className={className} onClick={onClick} {...props}> 
            {children}
        </button>   // for custom styles
    );
};

export default Button;