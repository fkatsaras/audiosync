import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const Input: React.FC<InputProps> = ({ id, type, placeholder='', value, onChange, className='', ...props}) => {
    return (
        <input 
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`common-input ${className}`}   // Allow custom class styling alongside base styles
            {...props}  // Spread additional attributes 
        />
    );
};

export default Input;