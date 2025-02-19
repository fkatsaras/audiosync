import React from 'react';
import { Link } from 'react-router-dom';
import './ResultItem.css';

interface ResultItemProps {
    id: number;
    imageSrc?: string;
    title: string;
    subtitle?: string;
    linkPath: string;
    altText: string;
    className?: string;
    optionsComponent?: React.ReactNode;   // Pass optional options button
    isLoading: boolean;
    textInfoChildren?: React.ReactNode
}

const ResultItem: React.FC<ResultItemProps> = ({ 
    id,
    imageSrc,
    title,
    subtitle,
    linkPath,
    altText,
    className,
    optionsComponent,
    isLoading=false,
    textInfoChildren,
}) => {

    if (isLoading) {
        return (
            <div className={`result-container ${className}`}>
                <div className='result-content'>
                    <div className='placeholder-image' />
                    <div className='placeholder-title' />
                    <div className='placeholder-subtitle' />
                </div>
            </div>
        );
    }

    return (     
        <Link to={`${linkPath}`} className={`result-container ${className}`}>
        <div className='result-content'>
            {imageSrc && (
                <img 
                    src={imageSrc}
                    alt={altText}
                    className={className}
                />
            )}
            <div className='text-content'>
                <div className='text-info-1'>
                    <h3 className='result-title'>{title}</h3>
                    {subtitle && <p className='result-subtitle'>{subtitle}</p>}
                </div>
                <div className='text-info-2'>   {/* Add Component specific children TODO : make this more modular */}
                    {textInfoChildren}
                </div>
            </div>          
        </div>
        {optionsComponent &&
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault();
                }} // Prevent click propagation
            >
                {optionsComponent}
            </div>}  {/* Conditionally render the options component here */}
        </Link>
    );
};

export default ResultItem;