/**
 * Represents a Song Object.
 * 
 * @interface Song
 * @property {number} id - The unique identifier for the song.
 * @property {string} title - The title of the song.
 * @property {string} artist - The name of the artist who performed the song.
 * @property {number} artist_id - The unique identifier for the artist.
 * @property {string} album - The name of the album the song belongs to.
 * @property {number} duration - The duration of the song in seconds.
 * @property {string} cover - The URL of the album cover or song cover image.
 * @property {boolean} liked - Indicates if the song is liked by the user.
 * @property {string[]} playlists - An array of playlist names this song belongs to.
 * @property {boolean} is_playing - A flag indicating if the song is currently playing.
 */
export interface Song {
    id: number;
    title: string;
    artist: string;
    artist_id: number;
    album: string;
    duration: number;
    cover: string;
    liked: boolean;
    playlists: string[];
    is_playing: boolean;
}

/**
 * Represents an Artist Object.
 * 
 * @interface Artist
 * @property {number} id - The unique identifier for the artist.
 * @property {string} name - The name of the artist.
 * @property {string} [profilePicture] - Optional URL for the artist's profile picture.
 * @property {Song[]} songs - An array of songs associated with the artist.
 * @property {number} followers - The number of followers the artist has.
 * @property {boolean} is_followed - Indicates if the user is following the artist.
 */
export interface Artist {
    id: number;
    name: string;
    profile_picture?: string; // Optional field
    songs: Song[];
    followers: number;
    is_followed: boolean;
}

/**
 * Playlist interface representing a user's playlist.
 */
export interface Playlist {
    id: number;             // The ID of the playlist
    title: string;          // The title of the playlist
    song_ids: string;     // Array of song id's
    songs?: Song[];         // Array of song objects
    edit_mode?: boolean;    // Indicates if the playlist is in edit mode
    cover?: string;         // URL to the cover image of the playlist
    owner: number;          // The ID of the owner of the playlist
    is_public: boolean;     // Indicates if the playlist is public
    isLikedSongs: boolean;  // Indicates if its a users Liked Songs playlist
    created_at: string;     // Timestamp of when the playlist was created
    updated_at?: string;    // Timestamp of when the playlist was last updated
    order: number;          // Order number of the song in the playlist
}
