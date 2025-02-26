import React from 'react';
import '../styles/LyricsPage.css';
import { Song } from '../types/data';

interface LyricsPageProps {
    song: Song | null;
}

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";


const LyricsPage: React.FC<LyricsPageProps> = ({ song }) => {
    if (!song || !song.lyrics) {
        return <div className='lyrics-page'>No lyrics available for this song...</div>;
    }

    return (
        <div className="lyrics-page">
          <div className="lyrics-text">
            {song.lyrics.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
    )
}