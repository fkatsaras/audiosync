import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import Search from './pages/SearchPage'
import NotFound from "./components/NotFound";
import CheckAuth from "./components/CheckAuth";
import SongPage from "./pages/SongPage";
import ArtistPage from "./pages/ArtistPage";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/home",
    element: <CheckAuth><Home /></CheckAuth>
  },
  { path: "/search",
    element: <CheckAuth><Search /></CheckAuth>
  },
  { 
    path: "/songs/:songId",
    element: <CheckAuth><SongPage /></CheckAuth> 
  },
  { 
    path: "/artists/:artistId",
    element: <CheckAuth><ArtistPage /></CheckAuth> 
  },
  { path: "*", element: <NotFound />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;