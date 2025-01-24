'use-strict'

const db = require('../../utils/dbUtils');

class UserRepository {
    static async getUsersFollowedArtists(connection, userId) {
        const query = `
            SELECT 
                a.id,
                a.name,
                a.followers,
                a.profile_picture
            FROM 
                followed_artists fa
            JOIN
                artists a ON fa.artist_id = a.id
            JOIN
                users u ON u.id = fa.user_id
            WHERE
                u.id = ?
        `;
        
        return db.executeQuery(connection, query, [userId])
    }

    static async getUsersHistory(connection, userId, latest) {
        let query = `
            SELECT s.*, a.name as artist
            FROM listening_history lh
            JOIN songs s ON lh.song_id = s.id
            JOIN artists a ON s.artist_id = a.id 
            WHERE lh.user_id = ?
            ORDER BY lh.played_at DESC
        `;

        if (latest) {
            query += ' LIMIT 1';
        }

        return db.executeQuery(connection, query, [userId])
    }

    static async addSongToUsersHistory(connection, { user_id, song_id, played_at }) {
        const query = `
            INSERT INTO listening_history (user_id, song_id, played_at)
            VALUES (?, ?, ?)
        `

        return db.executeQuery(connection, query, [user_id, song_id, played_at])
    }
}

module.exports = UserRepository;