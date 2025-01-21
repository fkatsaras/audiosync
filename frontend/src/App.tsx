import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import Search from './pages/SearchPage';
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import SongPage from "./pages/SongPage";
import ArtistPage from "./pages/ArtistPage";
import MyPlaylistsPage from "./pages/MyPlaylistsPage";
import PlaylistPage from "./pages/PlaylistPage";
import LikedSongsPlaylist from "./pages/LikedSongsPage";
import MyArtistsPage from './pages/MyArtistsPage';
import './App.css';
import { AudioPlayerProvider } from './context/AudioPlayerContext';

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/home",
    element:
      <Layout>
        <Home />
      </Layout>
  },
  { path: "/search", element: <Layout><Search /></Layout> },
  { path: "/songs/:songId", element: <Layout><SongPage /></Layout> },
  { path: "/artists/:artistId", element: <Layout><ArtistPage /></Layout> },
  { path: "/:userId/my-playlists", element: <Layout><MyPlaylistsPage /></Layout> },
  { path: "/:userId/playlists/:playlistId", element: <Layout><PlaylistPage /></Layout> },
  { path: "/:userId/liked-songs", element: <Layout><LikedSongsPlaylist /></Layout> },
  { path: "/:userId/my-artists", element: <Layout><MyArtistsPage /></Layout> },
  { path: "*", element: <NotFound /> }
]);

function App() {
  return (
    <AudioPlayerProvider>
      <RouterProvider router={router} />
    </AudioPlayerProvider>
  );
}

export default App;
