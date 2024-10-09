/**
 * Represents a Song Object
 * 
 * @interface Song
 * @property {number} id - The unique identifier for the song.
 * @property {string} title - The title of the song.
 * @property {string} [album] - Optional album name the song belongs to.
 * @property {string} duration - Duration of the song.
 */
export interface Song {    // !TODO! Song interface var order doesnt match the backend response body
    id: number,
    title: string,
    artist: string,
    artist_id: number,
    album: string,
    duration: number,
    cover: string,
    liked: boolean,
    playlists: string[],
    is_playing: boolean
}

/**
 * Represents an artist object.
 * 
 * @interface Artist
 * @property {number} id - The unique identifier for the artist.
 * @property {string} name - The name of the artist.
 * @property {string} [profile_picture] - Optional URL for the artist's profile picture.
 */
export interface Artist {
    id: number;
    name: string;
    profile_picture?: string;   // Optional field
    songs: Song[];
    followers: number;
    is_followed: boolean;
}