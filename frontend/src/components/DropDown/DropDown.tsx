import React from "react";
import "./DropDown.css";

interface DropDownProps {
  options: Array<{ label: string; value: string; icon?: string }>;
  onOptionSelect: (value: string) => void;
  className?: string;
}

const DropDown: React.FC<DropDownProps> = ({ options, onOptionSelect, className }) => {
  return (
    <ul className={`dropdown-container ${className || ""}`}>
      {options.map((option, index) => (
        <li
          key={index}
          className="dropdown-item"
          onClick={() => onOptionSelect(option.value)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onOptionSelect(option.value);
            }
          }}
        >
          {option.icon && <span className="dropdown-icon">{option.icon}</span>}
          <span className="dropdown-label">{option.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default DropDown;