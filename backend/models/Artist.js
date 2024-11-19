class Artist {
    /**
     * Constructs an Artist instance
     * @param {number} id - Unique identifier for the artist
     * @param {string} name - Name of the artist or band
     * @param {Array} songs - List of Song objects associated with the artist.
     * @param {number} followers - Number of followers for the artist.
     * @param {boolean} isFollowed - Whether the user follows the artist.
     * @param {string} profilePicture - URL of the artist's profile picture.
     */
    constructor(id = null, name = '', songs = [], followers = 0, isFollowed = false, profilePicture = '') {
        this.id = id;
        this.name = name;
        this.songs = songs;
        this.followers = followers;
        this.isFollowed = isFollowed;
        this.profilePicture = profilePicture;
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
            data.isFollowed || false,
            data.profilePicture || ''
        );
    }
}

module.exports = Artist;