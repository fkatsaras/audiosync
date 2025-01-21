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

    static async getUsersLastPlayedSong(connection, userId) {
        const query = `
            SELECT * FROM listening_history
            WHERE user_id = ?
            ORDER BY played_at DESC
            LIMIT 1
        `;

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