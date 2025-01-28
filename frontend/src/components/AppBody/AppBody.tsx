import React, { ReactNode, useEffect, useRef } from 'react';
import './AppBody.css';

interface AppBodyProps {
    children: ReactNode;
}

const AppBody: React.FC<AppBodyProps> = ({ children }) => {
    const appBodyRef = useRef<HTMLDivElement | null>(null);
    let timeoutId: NodeJS.Timeout;

    useEffect(() => {
        const appBody = appBodyRef.current;

        const handleScroll = () => {
            if (appBody) {
                appBody.classList.add('scroll-visible');
                clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    appBody.classList.remove('scroll-visible');
                }, 2000);
            }
        };

        if (appBody) {
            appBody.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (appBody) {
                appBody.removeEventListener('scroll', handleScroll);
            }
        };

    }, []);

    return (
        <div className='app-body' ref={appBodyRef}>
            {children}
        </div>
    );
};

export default AppBody;