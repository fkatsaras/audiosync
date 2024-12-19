import React, { createContext, useContext, useState, useRef } from 'react';

// Create a 'global state' for the audio player component using context

interface AudioPlayerContextProps {
    currentSong: {
        id: number;
        src: string;
        title: string;
        artist: string;
    } | null;
    isPlaying: boolean;
    setCurrentSong: (song: AudioPlayerContextProps['currentSong']) => void;
    togglePlayPause: () => void;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<AudioPlayerContextProps['currentSong']>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => console.error('Audio play error:', error));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                setCurrentSong,
                togglePlayPause,
                audioRef
            }}
        >
            {children}
            <audio ref={audioRef} src={currentSong?.src || undefined} />
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
    return context;
};