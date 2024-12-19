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
import LikedSongsPlaylist from "./pages/LikedSongsPage";
import './App.css';
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import { AudioPlayerProvider } from './context/AudioPlayerContext';


console.log(AudioPlayer, UserSession); // Ensure they are not undefined


const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/home",
    element: 
    <UserSession>
      <AudioPlayerProvider>
        <Home />
        <AudioPlayer />
      </AudioPlayerProvider>
    </UserSession>
  },
  { path: "/search",
    element: 
    <UserSession>
      <AudioPlayerProvider>
        <Search />
        <AudioPlayer />
      </AudioPlayerProvider>
    </UserSession>
  },
  { 
    path: "/songs/:songId",
    element: 
      <UserSession>
        <AudioPlayerProvider>
          <SongPage />
          <AudioPlayer />
        </AudioPlayerProvider>
      </UserSession> 
  },
  { 
    path: "/artists/:artistId",
    element: 
      <UserSession>
        <AudioPlayerProvider>
          <ArtistPage />
          <AudioPlayer />
        </AudioPlayerProvider>
      </UserSession> 
  },
  { 
    path: "/:userId/my-playlists",
    element: 
      <UserSession>
        <AudioPlayerProvider>
          <MyPlaylistsPage />
          <AudioPlayer />
        </AudioPlayerProvider>
      </UserSession> 
  },
  { 
    path: "/:userId/playlists/:playlistId",
    element: 
      <UserSession>
        <AudioPlayerProvider>
          <PlaylistPage />
          <AudioPlayer />
        </AudioPlayerProvider>
      </UserSession> 
  },
  {
    path: "/:userId/liked-songs",
    element: 
      <UserSession>
        <AudioPlayerProvider>
          <LikedSongsPlaylist />
          <AudioPlayer />
        </AudioPlayerProvider>
      </UserSession>
  },
  { path: "*", element: <NotFound />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
