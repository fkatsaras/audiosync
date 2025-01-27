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
    optionsComponent?: React.ReactNode   // Pass optional options button
    isLoading: boolean
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
        <Link to={`${linkPath}/${id}`} className={`result-container ${className}`}>
        <div className='result-content'>
            {imageSrc && (
                <img 
                    src={imageSrc}
                    alt={altText}
                    className={className}
                />
            )}
            <h3 className='result-title'>{title}</h3>
            {subtitle && <p className='result-subtitle'>{subtitle}</p>}
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