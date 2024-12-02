import React from 'react';
import './DropDown.css';

interface DropDownProps {
    options: Array<{ label: string, value: string }>;
    onOptionSelect: (value: string) => void;
    className?: string;
}

const DropDown: React.FC<DropDownProps> = ({ options, onOptionSelect, className }) => {
    return (
        <div className={`dropdown-container ${className || ''}`}>
            <ul className='dropdown-list'>
                {options.map((option, index) => (
                    <li
                        key={index}
                        className='dropdown-item'
                        onClick={() => onOptionSelect(option.value)}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DropDown;