import React from "react";
import Button from "../Buttons/Button";
import './PopUp.css';

interface PopUpProps {
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    children: React.ReactNode;
}

const PopUp: React.FC<PopUpProps> = ({ title, onConfirm, onCancel, children }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2>{title}</h2>
                <div className="popup-content">{children}</div>
                <div className="popup-actions">
                    <Button 
                        className="popup-confirm"
                        isSpecial={false}
                        onClick={onConfirm}
                    >OK</Button>
                    <Button 
                        className="popup-cancel"
                        isSpecial={false}
                        onClick={onCancel}
                    >Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default PopUp;