'use strict'

const db = require('../../utils/dbUtils');

class ArtistRepository {
    static async getArtistById(connection, artistId) {
        const query = `
            SELECT *
            FROM artists
            WHERE id = ?
        `;
        return db.executeQuery(connection, query, [artistId]);
    }

    static async isArtistFollowedByUser(connection, userId, artistId) {
        const query =  `
            SELECT 1
            FROM followed_artists
            WHERE user_id = ? AND artist_id = ?
        `;
        return db.executeQuery(connection, query, [userId, artistId]);
    }

    static async getSongsByArtistId(connection, artistId) {
        const query = `
            SELECT * 
            FROM songs
            WHERE artist_id = ?
        `;
        return db.executeQuery(connection, query, [artistId]);
    }

    static async updateProfilePicture(connection, artistId, profilePictureUrl) {
        const query = `
            UPDATE artists
            SET profile_picture = ?
            WHERE id = ?
        `;
        return db.executeQuery(connection, query, [profilePictureUrl, artistId]);
    }
}

module.exports = ArtistRepository;