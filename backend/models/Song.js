class Song {
    /**
     * Song - A model representing a song in the system.
     *
     * @param {number} id - Unique identifier for the song.
     * @param {string} title - Title or name of the song.
     * @param {number} artistId - ID of the artist who created the song.
     * @param {string} artist - Name of the artist who created the song.
     * @param {string} album - Name of the album containing the song.
     * @param {number} duration - Duration of the song in seconds.
     * @param {string} cover - Album cover image URL associated with the song.
     * @param {boolean} liked - Flag indicating if the user has liked the song.
     * @param {Array} playlists - List of playlists the song belongs to.
     * @param {boolean} isPlaying - Boolean flag indicating if the song is currently playing.
     */
    constructor(
      id = null,
      title = null,
      artistId = null,
      artist = null,
      album = null,
      duration = null,
      cover = null,
      liked = null,
      playlists = [],
      isPlaying = null
    ) {
      this._id = id;
      this._title = title;
      this._artistId = artistId;
      this._artist = artist;
      this._album = album;
      this._duration = duration;
      this._cover = cover;
      this._liked = liked;
      this._playlists = playlists;
      this._isPlaying = isPlaying;
    }
  
    static fromDict(data) {
      return new Song(
        data.id,
        data.title,
        data.artistId,
        data.artist,
        data.album,
        data.duration,
        data.cover,
        data.liked,
        data.playlists,
        data.isPlaying
      );
    }
  
    get id() {
      return this._id;
    }
  
    set id(value) {
      this._id = value;
    }
  
    get title() {
      return this._title;
    }
  
    set title(value) {
      this._title = value;
    }
  
    get artistId() {
      return this._artistId;
    }
  
    set artistId(value) {
      this._artistId = value;
    }
  
    get artist() {
      return this._artist;
    }
  
    set artist(value) {
      this._artist = value;
    }
  
    get album() {
      return this._album;
    }
  
    set album(value) {
      this._album = value;
    }
  
    get duration() {
      return this._duration;
    }
  
    set duration(value) {
      this._duration = value;
    }
  
    get cover() {
      return this._cover;
    }
  
    set cover(value) {
      this._cover = value;
    }
  
    get liked() {
      return this._liked;
    }
  
    set liked(value) {
      this._liked = value;
    }
  
    get playlists() {
      return this._playlists;
    }
  
    set playlists(value) {
      this._playlists = value;
    }
  
    get isPlaying() {
      return this._isPlaying;
    }
  
    set isPlaying(value) {
      this._isPlaying = value;
    }
  }
  
  export default Song;