'use-strict'

const db = require('../../utils/dbUtils');

class SearchRepository {

    // static async searchAll(connection, searchQuery, limit, offfset) {
    //     const dbQuery = `
    //         (
    //             SELECT id, name AS title, NULL AS duration, NULL AS cover, 'artist' AS type
    //             FROM artists
    //             WHERE LOWER(name) LIKE ?
    //         )
    //         UNION ALL
    //         (
    //             SELECT id, title, duration, cover, 'song' AS type
    //             FROM songs
    //             WHERE LOWER(title) LIKE ?
    //         )
    //         ORDER BY type, title
    //         LIMIT ? OFFSET ?;
    //     `
    // }
    static async searchArtists(connection, artistQuery, limit, offset) {
        const dbQuery = `
            SELECT id, name,
                CASE WHEN profile_picture IS NULL THEN 1 ELSE 0 END AS needs_pfp
            FROM artists
            WHERE LOWER(name) LIKE ?
            LIMIT ? OFFSET ?
        `;
        return db.executeQuery(connection, dbQuery, [artistQuery, limit, offset]);
    }

    static async searchSongs(connection, songQuery, limit, offset) {
        const dbQuery = `
            SELECT *, 
                CASE WHEN cover IS NULL THEN 1 ELSE 0 END AS needs_cover,
                artists.name as artist_name
            FROM songs
            JOIN artists ON artists.id = songs.artist_id
            WHERE LOWER(title) LIKE ?
            LIMIT ? OFFSET ?
        `;
        return db.executeQuery(connection, dbQuery, [songQuery, limit, offset]);
    }
}

module.exports = SearchRepository;