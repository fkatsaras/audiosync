import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import Search from './components/Search/Search'
import NotFound from "./components/NotFound";
import CheckAuth from "./components/CheckAuth";
import SongPage from "./components/Song/SongPage";
import ArtistPage from "./components/Artist/ArtistPage";

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