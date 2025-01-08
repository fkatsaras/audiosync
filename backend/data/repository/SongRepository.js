'use-strict'

const db = require('../../utils/dbUtils');

class SongsRepository {
    static async getSongById(connection, songId) {
        const query = `
            SELECT songs.*, artists.name AS artist_name
            FROM songs
            JOIN artists ON songs.artist_id = artists.id
            WHERE songs.id = ?
        `;

        return db.executeQuery(connection, query, [songId]);
    }

    static async updateCover(connection, songId, coverUrl) {
        const query = `
            UPDATE songs
            SET cover = ?
            WHERE id = ?
        `;
        return db.executeQuery(connection, query, [coverUrl, songId]);
    }

    static async updateAudioUrl(connection, songId, audioUrl) {
        const query = `
            UPDATE songs
            SET audio_url = ?
            WHERE id = ?
        `;
        return db.executeQuery(connection, query, [audioUrl, songId]);
    }

    static async updateVideoId(connection, songId, videoId) {
        const query = `
            UPDATE songs
            SET video_id = ?
            WHERE id = ?
        `;
        return db.executeQuery(connection, query, [videoId, songId]);
    }

    static async isSongLikedByUser(connection, userId, songId) {
        const query = `
            SELECT 1 FROM liked_songs
            WHERE user_id = ? AND song_id = ?
        `;
        return db.executeQuery(connection, query, [userId, songId]);
    }
}

module.exports = SongsRepository;