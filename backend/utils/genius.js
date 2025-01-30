const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./dbUtils');
require('dotenv').config();

const GENIUS_API_URL = 'https://api.genius.com';
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

/**
 * Search for a song on Genius using the title and artist name.
 */
const searchSong = async (songTitle, artistName) => {
    try {
        const response = await axios.get(`${GENIUS_API_URL}/search`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
            params: { q: `${songTitle} ${artistName}` }
        });

        if (response.data.response.hits.length > 0) {
            return response.data.response.hits[0].result.url;
        }

        return null;
    } catch (error) {
        console.error('Error searching for song: ', error.message);
        return null;
    }
};

/**
 * Scrape lyrics from a Genius song page.
 */
const getLyrics = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let lyrics = '';
        $('div[data-lyrics-container="true"]').each((i, elem) => {
            lyrics += $(elem).text().trim() + '\n';
        });

        return lyrics || 'Lyrics not found';
    } catch (error) {
        console.error('Error scraping lyrics: ', error.message);
        return null;
    }
};

module.exports = {
    searchSong,
    getLyrics
}