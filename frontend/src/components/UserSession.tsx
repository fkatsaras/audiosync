import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingDots from './LoadingDots/LoadingDots';

interface UserSessionProps {
  children: ReactNode;
}

interface User {
  userId: string;
  username: string;
}

const UserSession: React.FC<UserSessionProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/v1/users/check-login', {
          headers: {
            'Authorization' : `Bearer ${token}`
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ userId: data.body.user_id, username: data.body.username });
        } else {
          localStorage.removeItem('token'); // Remove invalid token
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };


    fetchUserData();
  }, []);

  if (loading) return <LoadingDots/>
  if (!user) return <Navigate to="/login" />

  // Pass the user data down to children via React Context or props
  return React.cloneElement(children as React.ReactElement, { userId: user.userId, username: user.username });
}

export default UserSession;