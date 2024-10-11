import React, { ReactNode } from 'react';
import './AppBody.css';

interface AppBodyProps {
    children: ReactNode;    // Children can be any renderable react node
}

const AppBody: React.FC<AppBodyProps> = ({ children }) => {
    return (<div className='app-body'>
        {children}
    </div>
    );
};

export default AppBody;