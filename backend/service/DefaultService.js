'use strict';

const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const db = require('../utils/dbUtils');
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env')});

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

let accessToken = null;

// Authenticate to get the token
async function authenticateWithSpotify() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        params: {
            grant_type: 'client_credentials',
        }
    });

    accessToken = response.data.access_token;
    console.log('Authenticated with Spotify!');
}

// Fetch songs from Spotify based on genre
async function fetchSongsByGenre(genre, limit = 50, maxSongs = 500) {
    const songs = [];
    let offset = 0;

    while (songs.length < maxSongs) {
        try {
            const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    q: `genre:${genre}`,  // Using the genre parameter
                    type: 'track',
                    limit: limit,
                    offset: offset,
                },
            });

            const tracks = response.data.tracks.items;
            if (tracks.length === 0) {
                console.log('No more tracks found');
                break;
            }

            tracks.forEach((track) => {
                songs.push({
                    title: track.name,
                    artistName: track.artists[0]?.name || null,
                    album: track.album.name,
                    duration: Math.round(track.duration_ms / 1000),
                    cover: track.album.images[0]?.url || null,
                    release_date: track.album.release_date ? track.album.release_date.slice(0, 4) : null,
                    popularity: track.popularity,
                });
            });

            console.log(`Fetched ${tracks.length} songs for genre: ${genre}`);
            offset += limit;

            // Spotify rate limit handling
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 request per second
        } catch (error) {
            console.log('Error fetching songs: ', error.message);
            break;
        }
    }
    return songs;
}

// Insert fetched songs into the database
async function insertSongsIntoDB(songs) {
    const connection = db.createConnection();

    try {
        await db.beginTransaction(connection);

        for (const song of songs) {
            // Check if artist exists or insert
            const artistResult = await db.executeQuery(
                connection,
                'SELECT id FROM artists WHERE name = ?',
                [song.artistName]
            );

            let artistId;
            if (artistResult.length > 0) {
                artistId = artistResult[0].id;
            } else {
                const insertArtist = await db.executeQuery(
                    connection,
                    'INSERT INTO artists (name, followers) VALUES (?,?)',
                    [song.artistName, Math.floor(Math.random() * 100000)] // Random follower count
                );
                artistId = insertArtist.insertId;
            }

            // Insert song into the database
            await db.executeQuery(
                connection,
                `INSERT INTO songs (title, artist_id, album, duration, cover, release_date, audio_url, popularity, is_playing)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    song.title,
                    artistId,
                    song.album,
                    song.duration,
                    song.cover,
                    song.release_date,
                    null,  // audio_url
                    song.popularity,
                    false, // is_playing
                ]
            );
        }

        await db.commitTransaction(connection);
        console.log('Songs inserted successfully.');
    } catch (error) {
        console.log(`Something went wrong while inserting songs: ${error.message}`);
        db.rollbackTransaction(connection);
    } finally {
        await db.closeConnection(connection);
    }
}

// Seed songs based on the genre passed in
async function seedSongsByGenre(genre) {
    try {
        await authenticateWithSpotify();

        console.log('Fetching songs...');
        const songs = await fetchSongsByGenre(genre, 50, 500);

        if (songs.length > 0) {
            console.log('Inserting songs into the DB...');
            await insertSongsIntoDB(songs);
            return {
                message: `Successfully seeded ${songs.length} songs of genre ${genre}`,
                body: songs,
            };
        } else {
            console.log('No songs found for the specified genre.');
            return {
                message: `No songs found for genre: ${genre}`,
                body: [],
            };
        }
    } catch (error) {
        console.log(`Error during seeding: ${error.message}`);
        throw error;
    }
}

module.exports = {
    seedSongsByGenre,
};