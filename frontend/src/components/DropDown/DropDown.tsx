import { forwardRef } from "react";
import React from "react";
import "./DropDown.css";

interface DropDownProps {
  options: Array<{ label: string; value: string; icon?: string }>;
  onOptionSelect: (value: string) => void;
  className?: string;
}

const DropDown = forwardRef<HTMLUListElement, DropDownProps>(
  ({ options, onOptionSelect, className }, ref) => {
    return (
      <ul
        ref={ref}
        className={`dropdown-container ${className || ""}`}
        role="menu"
      >
        {options.map((option, index) => (
          <li
            key={index}
            className="dropdown-item"
            role="menuitem"
            tabIndex={0}
            onClick={() => onOptionSelect(option.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onOptionSelect(option.value);
              }
            }}
          >
            {option.icon && (
              <span className="dropdown-icon" aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span className="dropdown-label">{option.label}</span>
          </li>
        ))}
      </ul>
    );
  }
);

export default DropDown;