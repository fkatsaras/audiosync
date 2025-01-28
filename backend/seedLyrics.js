const axios = require('axios');
const cheerio = require('cheerio');

require('dotenv').config();

const GENIUS_API_URL = 'https://api.genius.com'
const ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

/**
 * Seaarch for a song using the Genius API return its url
 */
const searchSong = async (query) => {
    try {
        const response = await axios.get(`${GENIUS_API_URL}/search`, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
            params: { q: query }
        });

        if (response.data.response.hits.length > 0) {
            return response.data.response.hits[0].result.url
        }

        return null;
    } catch (error) {
        console.error('Error fetching song: ', error.message);
        return null;
    }
};

/**
 * 'Get' lyrics from the genius page 
 */
const getLyrics = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let lyrics = '';
        $('div[data-lyrics-container="true"]').each((i, elem) => {
            lyrics += $(elem).text().trim() + '\n';
        })

        return lyrics || 'Lyrics not found';
    } catch (error) {
        console.error('Error "fetching" lyrics: ', error.message);
        return null;
    }
};

(
    async () => {
        const songQuery = "Bohemian Rhapsody Queen";
        const songUrl = await searchSong(songQuery);

        if (songUrl) {
            console.log('Song found! : ', songUrl);
            const lyrics = await getLyrics(songUrl);
            console.log('Lyrics: \n', lyrics);
        } else {
            console.log('Song not found');
        }
    }
)();