import React from "react";
import ResultItem from "./ResultItem";
import { Song } from "../../types/data";
import './SongResultItem.css';

interface SongResultItemProps {
  song: Song;
  isLoading: boolean;
  className?: string;
}

const SongResultItem: React.FC<SongResultItemProps> = ({ song, className, isLoading=false }) => {
    return (
        <ResultItem
            id={song.id}
            imageSrc={song.cover}
            title={song.title}
            subtitle={song.artist}
            linkPath={`/songs/${song.id}`}
            altText={`${song.title} album cover`}
            className={className}
            isLoading={isLoading}
            textInfoChildren={
                <p className='song-duration'>{song.duration}</p>
            }
         />
    );
};

export default SongResultItem;