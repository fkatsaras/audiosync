import React from 'react';
import AppBody from '../components/AppBody/AppBody';
import Navbar from '../components/Navbar/Navbar';
import ProfileBar from '../components/ProfileBar/ProfileBar';

interface UserSessionProps {
    userId?: string;
    username?: string;
}

const ProfilePage: React.FC<UserSessionProps> = ({ userId, username }) => {


    return (
        <div>
            <AppBody>
                <Navbar userId={userId || ''} username={username || ''} />
            </AppBody>
        </div>
    )
}