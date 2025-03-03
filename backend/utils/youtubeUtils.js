// const youtubedl = require('youtube-dl-exec');
const fetch = require('node-fetch');

/**
 * Fetch Youtube audio URL and video ID for a song
 * 
 * @param {Object} songData - Song Data JSON 
 * @returns {Object|null} Contains audioUrl and videoId if successful, null otherwise
 */
async function fetchYoutubeAudio(songData) {
    try {
        // If video_id exists, fetch the URL directly
        if (songData.video_id) {
            const [audioUrl, fetchedVideoId] = await getYTSongVideo(null, null, songData.video_id);
            if (audioUrl) {
                return {
                    audioUrl,
                    video_id: fetchedVideoId
                }
            }
            console.warn(`Failed to regenerate audio URL for video ID: ${songData.video_id}`);
        } else {
            // Fallback: Search by title if no video_id exists
            const [audioUrl, fetchedVideoId] = await getYTSongVideo(songData.title, songData.artist_name, null);
            if (audioUrl) {
                return {
                    audioUrl,
                    video_id: extractVideoId(fetchedVideoId)
                }
            }
            console.warn(`Failed to fetch audio URL for song: ${songData.title}`);
        }
        return null;
    } catch (error) {
        console.error(`Error fetching YouTube audio:`, error.message);
        return null;
    }
}

async function getYTSongVideo(songTitle, artistName, video_id) {
    try {
        // Build the query parameters
        const params = new URLSearchParams();
        if (video_id) {
            params.append('video_id', video_id);
        } else {
            params.append('song_title', songTitle);
            params.append('artist_name', artistName);
        }
        
        //  Flask API (local development or deployed on Vercel)
        const apiPort = 2000;
        const apiUrl = process.env.NODE_ENV === 'production' ? process.env.YT_API_URL : 'http://localhost';
        
        console.log(`Searching for: ${video_id || `${artistName} ${songTitle}`.trim()}`);
        
        const response = await fetch(`${apiUrl}:${apiPort}/api/v1/get-yt-song?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `No video results found for "${songTitle}"`);
        }
        
        const data = await response.json();
        
        console.log(`Found video: ${data.title} (${data.video_url})`);
        console.log(`Audio URL: ${data.audio_url}`);
        
        return [data.audio_url, data.video_url];
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw new Error("Failed to fetch song audio URL.");
    }
}

// async function getYTSongVideo(songTitle, artistName, video_id) {
//     try {
//         // Search by either video id or song title + artist name
//         const searchQuery = video_id ? `${video_id}` : `${artistName} ${songTitle}`.trim();
//         // Use ytsearch to retrieve a single video (not playlists)
//         const result = await youtubedl(`ytsearch:${searchQuery}`, {
//             dumpSingleJson: true,
//             noWarnings: true,
//             noCheckCertificate: true,
//             preferFreeFormats: true,
//             flatPlaylist: true // Ensures it does not fetch playlist details
//         });

//         if (!result || !result.entries || result.entries.length === 0) {
//             throw new Error(`No video results found for "${songTitle}"`);
//         }

//         // Get the first valid video result
//         const video = result.entries[0];
//         console.log(`Found video: ${video.title} (${video.url})`);

//         // Extract the best audio URL for the video
//         const audioDetails = await youtubedl(video.url, {
//             getUrl: true, // Directly fetch audio URL
//             format: "bestaudio" // Ensure the best available audio format
//         });

//         console.log(`Audio URL: ${audioDetails}`);
//         return [audioDetails, video.url];

//     } catch (error) {
//         console.error(`Error: ${error.message}`);
//         throw new Error("Failed to fetch song audio URL.");
//     }
// }

// Helper function to check if a video URL is expired
function isExpired(URL) {
    try {
        // Extract the 'expire' parameter from the URL
        const urlParams = new URLSearchParams(URL.split('?')[1]); // Extract params from the query string
        const expireParam = urlParams.get('expire');

        // Validate the 'expire' parameter
        if (!expireParam) {
            console.error("The 'expire' parameter is missing in the URL.");
            return true; // Treat as expired if the parameter is missing
        }

        const expireTimestamp = parseInt(expireParam, 10) * 1000; // Convert to milliseconds

        // Ensure the parsed timestamp is a valid number
        if (isNaN(expireTimestamp)) {
            console.error("Invalid 'expire' parameter value.");
            return true; // Treat as expired if invalid
        }

        // Compare with the current time
        return Date.now() > expireTimestamp;
    } catch (error) {
        console.error("Error parsing URL:", error.message);
        return true; // Treat as expired on error
    }
}

// Helper function to extract the video id from the url
function extractVideoId(URL) {
    const match = URL.match(/v=([a-zA-Z0-9_-]+)/);  // Use regex to match the id
    return match ? match[1] : null;
}

module.exports = {
    getYTSongVideo,
    isExpired,
    extractVideoId,
    fetchYoutubeAudio
};