import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { Song } from '../types/data';
// Create a 'global state' for the audio player component using context

interface AudioPlayerContextProps {
    currentSong: Song | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    setCurrentSong: (song: Song) => void;
    togglePlayPause: () => void;
    setSeek: (time: number) => void;
    setVolume: (volume: number) => void;
    setAudioState: React.Dispatch<React.SetStateAction<{    // Normally this wouldnt be here
        currentSong: Song | null;                           // but i cant pass UserSessionProps to the AudioPlayerContext
        isPlaying: boolean;
        currentTime: number;
        duration: number;
        volume: number;
    }>>;
    audioRef: React.RefObject<HTMLAudioElement>;
}

export const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [audioState, setAudioState] = useState({
        currentSong: null as Song | null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
    });

    const audioRef = useRef<HTMLAudioElement>(null);

    // Play/pause audio 
    const togglePlayPause = useCallback(() => {
        if (!audioRef.current) return;
    
        setAudioState(prev => {
            if (prev.isPlaying) {
                audioRef.current?.pause();
            } else {
                audioRef.current?.play().catch(error => console.error('Audio play error:', error));
            }
            return { ...prev, isPlaying: !prev.isPlaying };
        });
    }, []);

    // Seek audio 
    const setSeek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setAudioState(prev => ({ ...prev, currentTime: time }));
        }
    }, []);

    // Change Volume 
    const setVolume = useCallback((volume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        setAudioState(prev => ({...prev, volume}))
    },[]);

    // Change Song 
    const setCurrentSong = useCallback((song: Song) => {
        setAudioState(prev => ({
            ...prev,
            currentSong: song,
            currentTime: 0,
            duration: 0,
            isPlaying: false
        }));
    }, []);

    // Audio event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if(!audio) return;

        const updateTime = () => {
            setAudioState(prev => ({
                ...prev,
                currentTime: audio.currentTime,
                duration: audio.duration || 0
            }));
        };

        audio.addEventListener('timeupdate',updateTime);
        audio.addEventListener('loadedmetadata',updateTime);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateTime);
        };
    },[audioRef, audioState.currentSong]);

    return (
        <AudioPlayerContext.Provider
            value={{
                ...audioState,
                setSeek,
                setVolume,
                setCurrentSong,
                togglePlayPause,
                audioRef,
                setAudioState,
            }}
        >
            {children}
            {audioState.currentSong && <audio ref={audioRef} src={audioState.currentSong.audio_url} />}
        </AudioPlayerContext.Provider>
    );

};