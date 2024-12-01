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
}

const ResultItem: React.FC<ResultItemProps> = ({ id, imageSrc, title, subtitle, linkPath, altText, className }) => {
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
        </Link>
    );
};

export default ResultItem;