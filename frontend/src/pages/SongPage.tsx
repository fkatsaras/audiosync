import React , { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Song } from "../types/data";
import Message from "../components/Message/Message";
import LoadingDots from "../components/LoadingDots/LoadingDots";
import LikeButton from "../components/Buttons/LikeButton";
import '../styles/SongPage.css'
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import PlayButton from "../components/Buttons/PlayButton";
import { useUser } from "../context/UserContext";
import { LiaMicrophoneAltSolid } from "react-icons/lia";


interface Line {
    time: number;
    line: string;
}

interface Section {
    header?: string;
    text: Line[];
}


const SongPage: React.FC = () => {
    const user = useUser();
    const { songId } = useParams<{ songId: string }>(); // Get song ID from URL parameters
    const location = useLocation();
    const navigate = useNavigate();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [likeMessage, setLikeMessage] = useState<string | null>(null);
    const [viewMode, setViewMode] =useState<'song' | 'lyrics'>('song');
    const [lyrics, setLyrics] = useState<Section[] | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [highlightedLineIndex, setHighlightedLineIndex] = useState<HighlightedLineIndex | null>(null);

    // Use the AudioPlayer through its hook 
    const { setCurrentSong, togglePlayPause, isPlaying } = useAudioPlayer();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const initialView = queryParams.get("view") === "lyrics" ? "lyrics" : "song";
        setViewMode(initialView);

        // Fetch the song details from the backend
        const fetchSong = async () => {
            try {
                const response = await fetch(`/api/v1/songs/${songId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data  = await response.json();
                    setSong(data.body); // Set the song data
                } else {
                    setError('Song not found');
                }
            } catch (err) {
                setError('Error fetching song data');
            } finally {
                setLoading(false);
            }
        };

        fetchSong();
    }, [songId, location.search]);

    useEffect(() => {
        const fetchLyrics = async () => {
            if (viewMode === "lyrics" && !lyrics) {
                try {
                    const response = await fetch(`/api/v1/songs/${songId}/lyrics`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });
                    const lyricsData = await response.json();
                    setLyrics(lyricsData.body.lyrics);
                } catch {
                    setLyrics([{
                        header: "",
                        text: [{ time: 0, line: "Lyrics not available" }],
                    }]);
                }
            }
        };

        fetchLyrics();
    }, [viewMode, songId]);

    /**
     * Lyrics view highlighting
     * 
     */
    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentTime(prevTime => prevTime + 1);
            },1000);

            return () => clearInterval(interval);
        }
    }, [isPlaying]);

    type HighlightedLineIndex = { sectionIdx: number, lineIdx: number } | null;

    useEffect(() => {
        // Check which line should be highlighted based on the current time
        const findHighlightedLine = () => {
            let newHighlightedLineIndex: HighlightedLineIndex = null; // Initialize as null
        
            // Check if lyrics are available
            if (!lyrics) return;  // If lyrics is null or undefined, stop execution
    
            // Loop through all lyrics sections and lines
            for (let sectionIdx = 0; sectionIdx < lyrics.length; sectionIdx++) {
                const section = lyrics[sectionIdx];
                const sectionLines = section.text || [];
        
                for (let lineIdx = 0; lineIdx < sectionLines.length; lineIdx++) {
                    const lineObj = sectionLines[lineIdx];
                    const timestamp = lineObj.time || 0;
                    
                    const lastTimeInterval = timestamp - sectionLines[lineIdx - 1]?.time || 0; 
                    // Check if currentTime is within the range of the current line
                    const nextTimestamp = (sectionIdx === lyrics.length - 1 && lineIdx === sectionLines.length - 1)
                            ? Infinity  // If it's the last line of the last section
                            : (sectionLines[lineIdx + 1]?.time || timestamp + lastTimeInterval);
        
                    if (currentTime >= timestamp && currentTime < nextTimestamp) {
                        newHighlightedLineIndex = { sectionIdx, lineIdx }; // Set object with section and line index
                        break; // Stop once the current line is found
                    }
                }
        
                if (newHighlightedLineIndex) break; // Stop if the current line was found
            }
        
            // Update the highlighted line index state
            setHighlightedLineIndex(newHighlightedLineIndex);
        };
    
        findHighlightedLine();
    }, [currentTime, lyrics]); // Depend on currentTime and lyrics

    const generateHighlightedLyrics = (lyrics: Section[], currentTime: number) => {
        return lyrics.map((section, idx) => {
            const sectionTitle = section.header || "";
            const sectionLines = section.text || []; 
    
            return (
                <div key={idx} className="lyrics-section">
                    <h3>{sectionTitle}</h3>
                    {sectionLines.map((lineObj, lineIdx) => {
                        
                        const timestamp = lineObj.time || 0;
    
                        const lastTimeInterval = timestamp - sectionLines[lineIdx - 1]?.time || 0;  // Calculating next time at the end of a section is tricky
                        const nextTimestamp = (idx === lyrics.length - 1 && lineIdx === sectionLines.length - 1)
                            ? Infinity  // If it's the last line of the last section
                            : (sectionLines[lineIdx + 1]?.time || timestamp + lastTimeInterval); // Otherwise, calculate the next timestamp
    
                        // Check if the current time falls between the current and next timestamp
                        const isCurrentLine = currentTime >= timestamp && currentTime < nextTimestamp;
    
                        // Render each line with optional highlighting
                        return (
                            <p key={lineIdx} className={isCurrentLine ? "highlighted" : ""}>
                                {lineObj.line}
                            </p>
                        );
                    })}
                </div>
            );
        });
    };

    const handleLikeToggle = async () => {
        if (!song) return;

        const action = song.liked ? 'DELETE' : 'POST';
        const endpoint = `/api/v1/users/${user?.userId}/liked-songs?songId=${songId}`;

        const response = await fetch(endpoint, {
            method: action,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setSong(prevSong => ({
                ...prevSong!,
                liked: data.body.liked  // Update the songs liked status
            }));
            setLikeMessage(data.body.liked ? 'Song Liked!' : "");

            setTimeout(() => {
                setLikeMessage(null);
            },6000);
        } else {
            const errorData = await response.json();
            setMessage(errorData.message);
        }
    };

    const handleToggleView = () => {
        const newViewMode = viewMode === "song" ? "lyrics" : "song";
        setViewMode(newViewMode);
    
        // Update the URL without refreshing
        navigate(`/songs/${songId}?view=${newViewMode}`, { replace: true });
    };

    if (loading) return <LoadingDots />;
    if (error) return <div>{error}</div>;


    return (
        <div className="song-container">
            { song ? (
            <div>
                <h1 className="header">{song.title}</h1>
                <div className="song-info">
                    <div className="like-button-container">
                        <LikeButton isLiked={song.liked} onToggle={handleLikeToggle}/>
                        <div
                        className="lyrics-button"
                        style={{
                            color: viewMode === "lyrics" ? "#6a1b9a" : lyrics ? 'white' : 'grey',  // Grey if no lyrics, white if available
                            cursor: lyrics ? 'pointer' : 'not-allowed',
                            position: "relative"
                        }}
                        onClick={handleToggleView}
                        >
                            <LiaMicrophoneAltSolid />
                            {viewMode === "lyrics" && (
                                <span className="lyrics-indicator"></span>
                            )}
                        </div>
                        {likeMessage && <Message className={`like-info-message ${likeMessage ? 'fade-in' : 'fade-out'}`}>{likeMessage}</Message>}
                    </div>
                    <p>Artist: <Link to={`/artists/${song.artist_id}`}>{song.artist}</Link></p>
                    <p>Album: {song.album}</p>
                    {/* Conditional rendering based on viewMode */}
                    {viewMode === 'song' ? (
                            <div className="song-image-container">
                                <img src={song.cover} alt={`${song.title} cover`} className="song-cover" />
                                <PlayButton className="image-button" isPlaying={false} onToggle={() => {
                                    if (song) {
                                        setCurrentSong({
                                            id: song.id,
                                            title: song.title,
                                            artist: song.artist,
                                            artist_id: song.artist_id,
                                            audio_url: song.audio_url,
                                            album: song.album,
                                            duration: song.duration,
                                            cover: song.cover,
                                            liked: song.liked,
                                            playlists: song.playlists,
                                            is_playing: true
                                        });
                                        togglePlayPause();
                                    }
                                }} />
                            </div>
                        ) : (
                            <div className="lyrics-container">
                                 {lyrics ? generateHighlightedLyrics(lyrics, currentTime) : <LoadingDots />}
                            </div>
                        )}
                    {message && <Message className="info-message">{message}</Message>}
                </div>
            </div>
            ) : (
                <Message className="info-message">Song not found.</Message>
            )}
        </div>
    )
}

export default SongPage;
