import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import Search from './pages/SearchPage'
import NotFound from "./components/NotFound";
import UserSession from "./components/UserSession";
import SongPage from "./pages/SongPage";
import ArtistPage from "./pages/ArtistPage";
import MyPlaylistsPage from "./pages/MyPlaylistsPage";
import PlaylistPage from "./pages/PlaylistPage";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/home",
    element: <UserSession><Home /></UserSession>
  },
  { path: "/search",
    element: <UserSession><Search /></UserSession>
  },
  { 
    path: "/songs/:songId",
    element: <UserSession><SongPage /></UserSession> 
  },
  { 
    path: "/artists/:artistId",
    element: <UserSession><ArtistPage /></UserSession> 
  },
  { 
    path: "/:userId/my-playlists",
    element: <UserSession><MyPlaylistsPage /></UserSession> 
  },
  { 
    path: "/:userId/playlists/:playlistId",
    element: <UserSession><PlaylistPage /></UserSession> 
  },
  { path: "*", element: <NotFound />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
