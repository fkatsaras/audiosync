import React, { createContext, useState, useRef, useEffect } from 'react';

// Create a 'global state' for the audio player component using context

interface AudioPlayerContextProps {
    currentSong: {
        id: number;
        src: string;
        title: string;
        artist: string;
    } | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    setCurrentSong: (song: AudioPlayerContextProps['currentSong']) => void;
    togglePlayPause: () => void;
    setSeek: (time: number) => void;
    setVolume: (volume: number) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentSong, setCurrentSong] = useState<AudioPlayerContextProps['currentSong']>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration,setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(1);
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

    const setSeek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    // Effect to track time update
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener('timeupdate',updateTime);
        audio.addEventListener('loadmetadata',updateTime);

        return () => {
            audio.removeEventListener('timeupdate',updateTime);
            audio.removeEventListener('loadmetadata',updateTime);
        };
    },[audioRef]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    },[volume]);

    return (
        <AudioPlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                currentTime,
                duration,
                volume,
                setSeek,
                setVolume,
                setCurrentSong,
                togglePlayPause,
                audioRef
            }}
        >
            {children}
            {currentSong && <audio ref={audioRef} src={currentSong?.src || ""} />}
        </AudioPlayerContext.Provider>
    );
};