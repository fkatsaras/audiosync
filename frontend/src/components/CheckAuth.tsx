import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface CheckAuthProps {
  children: ReactNode;
}

function CheckAuth({ children }: CheckAuthProps) {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to='/login' />;
}

export default CheckAuth;