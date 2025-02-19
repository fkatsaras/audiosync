import React from "react";
import ResultItem from "./ResultItem";
import { Playlist } from "../../types/data";
import { useUser } from "../../context/UserContext";
import defaultCover from '../../assets/images/playlist_default_cover.svg';
import likedSongsCover from '../../assets/images/liked_songs_cover.svg';

interface PlaylistResultItemProps {
  playlist: Playlist;
  isLoading: boolean;
  className?: string;
  optionsComponent?: React.ReactNode;
}

const PlaylistResultItem: React.FC<PlaylistResultItemProps> = ({ playlist, className, optionsComponent, isLoading=false }) => {
    const user = useUser();
    return (
        <ResultItem
            id={playlist.id}
            imageSrc={playlist.isLikedSongs? likedSongsCover : playlist.cover? playlist.cover : defaultCover}
            title={playlist.title}
            subtitle={
                playlist.song_ids && playlist.song_ids.length > 0
                    ? `${playlist.song_ids.length} songs`
                    : 'No songs added'
            }
            linkPath={playlist.isLikedSongs? `/${user?.userId}/liked-songs` : `/${user?.userId}/playlists/${playlist.id}`}
            altText={`${playlist.title} cover`}
            className={className}
            isLoading={isLoading}
            optionsComponent={optionsComponent}
         />
    );
};

export default PlaylistResultItem;