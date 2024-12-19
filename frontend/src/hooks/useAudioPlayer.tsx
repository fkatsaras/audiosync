import { useContext } from 'react';
import { AudioPlayerContext } from '../context/AudioPlayerContext';

export const useAudioPlayer = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
    return context;
};
