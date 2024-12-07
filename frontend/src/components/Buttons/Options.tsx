import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from 'react-icons/fa';
import DropDown from "../DropDown/DropDown";
import './Options.css';

interface OptionsProps {
    onOptionSelect: (value: string) => void;
    onClose: () => void;
}

const Options: React.FC<OptionsProps> = ({ onOptionSelect, onClose }) => {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement | null>(null);

    // Effect to handle click outsid the options drop down
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setIsDropDownOpen(false);
                onClose();
            }
        }

        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleToggleDropDown = (e: React.MouseEvent) => {
        e.stopPropagation();    // Prevent event propagation
        e.preventDefault();
        setIsDropDownOpen(!isDropDownOpen);
    };

    return (
        <div className="options-container" ref={optionsRef}>
            <div className="three-dots-button" onClick={handleToggleDropDown}>
                <FaEllipsisV />
            </div>
            {isDropDownOpen && (
                <DropDown
                    options={[
                        {label: "Edit", value: "edit"},
                        {label: "Delete", value: "delete"},
                    ]}
                    onOptionSelect={(value) => {
                        onOptionSelect(value);
                        setIsDropDownOpen(false);   // Close dropdown after selection
                    }}
                />
            )}
        </div>
    );
};

export default Options;