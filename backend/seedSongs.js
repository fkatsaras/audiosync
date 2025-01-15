const { response } = require('express');
const db = require('./utils/dbUtils');
const axios = require('axios');
require('dotenv').config();

process.env.NODE_ENV = 'test';

// Spotify API credentials 
let accessToken = null;
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

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
    console.log('Authenticated w/ spotify!');
}

// Fetch metal songs in bulk using api
async function fetchSongs(limit = 50, maxSongs = 500) {
    const songs = [];
    let offset = 0;

    while (songs.length < maxSongs) {
        try {
            const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
                headers: {
                    Authorization: `Bearer: ${accessToken}`,
                },
                params: {
                    q: 'genre:metal',
                    type: 'track',
                    limit: limit,
                    offset: offset
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
                    release_date: track.album.release_date || null,
                    popularity: track.popularity
                });
            });

            console.log(`Fetched ${tracks.length} songs`);

            offset += limit;

            // Stop if we've hit the desired number of songs
            if (songs.length >= maxSongs) {
                break;
            }

            // Spotify rate limit
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 req per sec
        } catch (error) {
            console.log('Error fetching songs: ', error.message);
            console.log(response);
            break;
        }

    }
    return songs;
}

// Insert fetched songs in the db
async function insertDatatoDB(songs) {
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
                    [song.artistName, Math.floor(Math.random() * 100000)] // Random follower count ?
                );
                artistId = insertArtist.insertId;
            }

            // Insert song into the database
            await dbUtils.executeQuery(
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
                    song.audio_url,
                    song.popularity,
                    false, // is_playing default to false
                ]
            );
        }

        await dbUtils.commitTransaction(connection);
        console.log('Songs inserted successfully.');
    } catch (error) {
        console.log(`Sonething went wrong while inserting songs: ${error.message}`);
        db.rollbackTransaction(connection);
    } finally {
        await db.closeConnection(connection);
    }
}

// Main
(async function seedData() {
    try {
        await authenticateWithSpotify();

        console.log('Fetching songs...');
        const songs = await fetchSongs(50, 500);
        if (songs.lenght > 0) {
            console.log('Inserting songs into the db...');
            await insertDatatoDB(songs);
        } else {
            console.log('No songs to seed.')
        }
    } catch (error) {console.log(`Error during seeding: ${error.message}`)}
}) ();