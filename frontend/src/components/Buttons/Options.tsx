import React, { useState } from "react";
import { FaEllipsisV } from 'react-icons/fa';
import DropDown from "../DropDown/DropDown";
import './Options.css';

interface OptionsProps {
    onOptionSelect: (value: string) => void;
}

const Options: React.FC<OptionsProps> = ({ onOptionSelect }) => {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const handleToggleDropDown = (e: React.MouseEvent) => {
        e.stopPropagation();    // Prevent event propagation
        e.preventDefault();
        setIsDropDownOpen(!isDropDownOpen);
    };

    return (
        <div className="options-container">
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