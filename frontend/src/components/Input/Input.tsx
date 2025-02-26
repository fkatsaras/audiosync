import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnter?: () => void;
    className?: string;
}

const Input: React.FC<InputProps> = ({ id, type, placeholder='', value, onChange, onEnter, className='', ...props}) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onEnter) {
          onEnter();
        }
      };

    return (
        <input 
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={`common-input ${className}`}   // Allow custom class styling alongside base styles
            {...props}  // Spread additional attributes 
        />
    );
};

export default Input;