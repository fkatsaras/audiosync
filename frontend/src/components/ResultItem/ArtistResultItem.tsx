import React from "react";
import ResultItem from "./ResultItem";
import { Artist } from "../../types/data";

interface ArtistResultItemProps {
  artist: Artist;
  isLoading: boolean;
  className?: string;
}

const ArtistResultItem: React.FC<ArtistResultItemProps> = ({ artist, className, isLoading=false }) => {
    return (
        <ResultItem
            id={artist.id}
            imageSrc={artist.profile_picture}
            title={artist.name}
            subtitle=''
            linkPath={`/artists/${artist.id}`}
            altText={`${artist.name} profile picture`}
            className={className}
            isLoading={isLoading}
         />
    );
};

export default ArtistResultItem;