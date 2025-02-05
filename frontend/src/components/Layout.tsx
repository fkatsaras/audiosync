import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import UserSession from "./UserSession";
import Navbar from "./Navbar/Navbar";
import AppBody from "./AppBody/AppBody";
import ContentBar from "./ContentBar/ContentBar";
import TopBar from './TopBar/TopBar';
import '../styles/Layout.css';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Paths where AudioPlayer should not be displayed
  const hideAudioPaths = ["/", "/login", "/register"];
  const showAudio = !hideAudioPaths.includes(location.pathname);

  // Resizing
  const [leftWidth, setLeftWidth] = useState(15);
  const [rightWidth, setRightWidth] = useState(30);

  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  const handleMouseMove = (e: MouseEvent, type: string) => {
    const viewportWidth = window.innerWidth;

    if (type === 'left') {
      setLeftWidth(e.clientX / viewportWidth * 100); // Adjust NavBar width
    } else if (type === 'right') {
      setRightWidth(((viewportWidth - e.clientX - (leftWidth / 100) * viewportWidth) / viewportWidth) * 100); // Adjust ContentBar width
    }
  };

  const handleMouseUp = () => {
    if (mouseMoveHandlerRef.current) {
      document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      mouseMoveHandlerRef.current = null;
    }
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, type: string) => {
    mouseMoveHandlerRef.current = (event: MouseEvent) => handleMouseMove(event, type);
    if (mouseMoveHandlerRef.current) {
      document.addEventListener("mousemove", mouseMoveHandlerRef.current);
    }
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div>
      <UserSession> {/* Wrap children with UserSession */}
        <div className="app">
          <TopBar />
          <div className='app-view'>
            <Navbar style={{ width: `${leftWidth}vw` }}/> 
            <div 
              className="resizer" 
              id="left-resizer"
              onMouseDown={(e) => handleMouseDown(e, 'left')}
            ></div>
            <AppBody>
              {children} {/* Render children (the page content) */}
            </AppBody>
            <div 
              className="resizer"
              id="right-resizer"
              onMouseDown={(e) => handleMouseDown(e, 'right')}
            ></div>
            <ContentBar style={{ width: `${rightWidth}vw` }}/>
          </div>
          {showAudio && <AudioPlayer />} {/* Render AudioPlayer inside UserSession so we can get userId, username props in here */}
        </div>
      </UserSession>
    </div>
  );
};

export default Layout;