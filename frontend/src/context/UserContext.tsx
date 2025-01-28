import React, { createContext, useContext } from 'react';

interface User {
    userId: string;
    username: string;
}

interface UserContextProps {
    user: User | null;
}

const UserContext = createContext<UserContextProps | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context.user;
}

export const UserProvider: React.FC<{ user: User | null; children: React.ReactNode }> = ({ user, children }) => {
    return <UserContext.Provider value={{ user }}>{ children }</UserContext.Provider>
}