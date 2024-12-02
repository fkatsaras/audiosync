class Artist {  // TODO : Convert this to ES6
    /**
     * Constructs an Artist instance
     * @param {number} id - Unique identifier for the artist
     * @param {string} name - Name of the artist or band
     * @param {Array} songs - List of Song objects associated with the artist.
     * @param {number} followers - Number of followers for the artist.
     * @param {boolean} is_followed - Whether the user follows the artist.
     * @param {string} profile_picture - URL of the artist's profile picture.
     */
    constructor(id = null, name = '', songs = [], followers = 0, is_followed = false, profile_picture = '') {
        this.id = id;
        this.name = name;
        this.songs = songs;
        this.followers = followers;
        this.is_followed = is_followed;
        this.profile_picture = profile_picture;
    }

    /**
     * Serialize the Artist instance into a plain object.
     * @returns {Object} - The plain object representation of the Artist.
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            songs: this.songs.map(song => song.toJSON()), // Assuming songs are instances of a Song class with a toJSON method
            followers: this.followers,
            is_followed: this.is_followed,
            profile_picture: this.profile_picture
        };
    }

    /**
     * Deserialize a plain object into an Artist instance.
     * @param {Object} data - The plain object containing artist data.
     * @returns {Artist}
     */
    static fromObject(data) {
        return new Artist(
            data.id,
            data.name,
            data.songs || [],
            data.followers || 0,
            data.is_followed || false,
            data.profile_picture || ''
        );
    }
}

module.exports = Artist;
