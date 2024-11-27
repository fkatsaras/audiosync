'use strict';

const db = require('../utils/dbUtils');

/**
 * Get details of a specific playlist
 * Retrieve details of a specific playlist created by a user
 *
 * userId Integer ID of the user who owns the playlist
 * playlistId Integer ID of the playlist to fetch details for
 * returns Playlist
 **/
exports.get_playlist_by_id = function(userId,playlistId) {
    return new Promise(async (resolve, reject) => {
        const connection = db.createConnection();
        try {
            const selectQuery = `
                SELECT
                    playlists.*,
                    songs.id AS song_id,
                    songs.title AS song_title,
                    songs.artist_id,
                    artists.name AS artist_name
                FROM playlists
                JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
                JOIN song ON playlist_songs.song_id = song.id
                JOIN artists ON songs.artist_id = artists.id
                WHERE playlists.id = ?
                AND playlists.owner = ? 
            `;

            const selectResult = await db.executeQuery(connection, selectQuery, [playlistId, userId]);

            if (selectResult.length > 0) {
                const playlistData = {
                    id: selectResult[0].id,
                    title: selectResult[0].title,
                    cover: selectResult[0].cover,
                    created_at: selectResult[0].created_at,
                    updated_at: selectResult[0].updated_at,
                    songs: []
                };

                // Add songs to the paylist
                selectResult.forEach(row => {
                    playlistData.songs.push({
                        id: row.song_id,
                        title: row.title,
                        artist: row.artist_name
                    });
                });

                resolve({
                    message: "Playlist retrieved successfully",
                    body: playlistData
                });
            } else {
                reject({
                    message: 'Playlist not found',
                    code: 404
                });
            }
        } catch(error) {
            console.error(`Error fetching playlist: ${error}`);
            reject({
                message: "Unexpected.",
                code: 500
            })
        } finally {
            db.closeConnection(connection);
        }
    });
  }
  