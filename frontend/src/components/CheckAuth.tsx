import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface CheckAuthProps {
  children: ReactNode;
}

function CheckAuth({ children }: CheckAuthProps) {
  const token = localStorage.getItem('token');

  // Make sure you return a valid JSX element or null
  if (token) {
      return <div>{children}</div>; // Wrap the children in a fragment to ensure it's a valid JSX element
  }
  
  return <Navigate to='/login' />;
}

export default CheckAuth;