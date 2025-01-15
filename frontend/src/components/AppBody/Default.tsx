import React, { ReactNode } from 'react';
import './Default.css';

interface DefaultBodyProps {
    children: ReactNode;    // Children can be any renderable react node
}

const Default: React.FC<DefaultBodyProps> = ({ children }) => {
    return (<div className='default-body'>
        {children}
    </div>
    );
};

export default Default;