import React from "react";
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import useAuthToken from './hooks/useAuthToken';

const App = () => {
  const isTokenValid = useAuthToken(); // Check token validity

  const router = createBrowserRouter([
    { path: "/", element: <Landing /> },
    { path: "/login", element: <Login /> },
    {
      path: "/home",
      element: localStorage.getItem('token') ? <Home /> : <Navigate to='/login' />
    },
    { path: "*", element: <Navigate to="/" />}  // Fix this later to NOT FOUND page
  ]);

  return <RouterProvider router={router} />;
}

export default App;