import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode; // Render button text or icons
    className?: string; // Optional classname attr
    isSpecial?: boolean // Action button attr
    isActive?: boolean; // Active / inactive attr
    type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '', //Default to empty incase no name is provided
    isSpecial = false,
    isActive = false, // Default to false
    type = 'button', // Default to button
    ...props    // Spread additional props that will be given in some cases
}) => {

    // Add active or inactive class dynamically
    const buttonClass = `default-button ${ isSpecial ? (isActive ? 'active' : 'inactive') : ''} ${className}`;

    return (
        <button type={type} className={buttonClass} {...props}> 
            {children}
        </button>   // for custom styles
    );
};

export default Button;