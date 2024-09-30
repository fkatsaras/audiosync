import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Search from './components/Search/Search'
import NotFound from "./components/NotFound";
import CheckAuth from "./components/CheckAuth";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  {
    path: "/home",
    element: <CheckAuth><Home /></CheckAuth>
  },
  { path: "/search",
    element: <CheckAuth><Search /></CheckAuth>
  },
  { path: "*", element: <NotFound />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;