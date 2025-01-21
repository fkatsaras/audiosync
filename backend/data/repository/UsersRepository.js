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
}

module.exports = UserRepository;