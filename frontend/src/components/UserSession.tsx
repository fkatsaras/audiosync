import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingDots from './LoadingDots/LoadingDots';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { UserProvider } from '../context/UserContext';

interface User {
  userId: string;
  username: string;
}

interface UserSessionProps {
  children?: ReactNode;
}

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";


const UserSession: React.FC<UserSessionProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const checkTokenValidity = () => {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          alert("Your session has expired. Please log in again.");
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        localStorage.removeItem("token");
      }
    };

    const fetchUserData = async () => {
      checkTokenValidity();

      try {
        const response = await fetch(`${API}/users/check-login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });


        if (response.ok) {
          const data = await response.json();
          setUser({ userId: data.body.user_id, username: data.body.username });
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingDots />;
  if (!user) return <Navigate to="/login" />;

  return <UserProvider user={user}>{children}</UserProvider>;
};

export default UserSession;