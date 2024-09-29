import React from "react";
import { createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Search from './components/Search/Search'
import NotFound from "./components/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  {
    path: "/home",
    element: localStorage.getItem('token') ? <Home /> : <Navigate to='/login' />
  },
  { path: "/search",
    element: localStorage.getItem('token') ? <Search /> : <Navigate to='/login' />
  },
  { path: "*", element: <NotFound />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;