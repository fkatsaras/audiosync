import React from "react";
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Home from './components/Home';
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  {
    path: "/home",
    element: localStorage.getItem('token') ? <Home /> : <Navigate to='/login' />
  },
  { path: "*", element: <NotFound />}  // Fix this later to NOT FOUND page
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;