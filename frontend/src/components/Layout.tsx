import React from "react";
import { useLocation } from "react-router-dom";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import UserSession from "./UserSession";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Paths where AudioPlayer should not be displayed
  const hideAudioPaths = ["/", "/login", "/register"];
  const showAudio = !hideAudioPaths.includes(location.pathname);

  return (
    <div>
      {showAudio && <AudioPlayer />} {/* Render AudioPlayer based on route */}
      <UserSession> {/* Wrap children with UserSession */}
        {children} {/* Render children (the page content) */}
      </UserSession>
    </div>
  );
};

export default Layout;