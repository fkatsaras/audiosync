// const { google } = require('googleapis');
// const ytdl = require('ytdl-core');

// const API_KEY = process.env.YOUTUBE_API_KEY;

// async function getYTSongInfo(songTitle) {
//     try {
//         // Initialize YouTube API client
//         const youtube = google.youtube({
//             version: 'v3',
//             auth: API_KEY
//         });

//         // Search the song on YouTube
//         const response = await youtube.search.list({
//             part: 'snippet',
//             q: songTitle,
//             type: 'video',
//             maxResults: 1   // Fetch the top result
//         });

//         if (response.data.items.length === 0) {
//             throw new Error(`No results found for "${songTitle}"`);
//         }

//         // Get the first video from the response
//         const video = response.data.items[0];

//         // Get the video ID
//         const videoId = video.id.videoId;
//         console.log(`Video found: ${video.snippet.title} (ID: ${videoId})`);

//         // Use ytdl-core to extract the audio URL
//         const info = await ytdl.getInfo(videoId);
//         const audioFormat = ytdl.filterFormats(info.formats, 'audioonly');

//         if (!audioFormat) {
//             throw new Error('Audio format not available for this video.');
//         }

//         console.log(`Audio URL: ${audioFormat.url}`);

//         return audioFormat.url;
//     } catch (error) {
//         console.error(`Error while fetching song URL from YouTube: ${error.message}`);
//         throw new Error('Unable to fetch audio from YouTube.');
//     }
// }

// module.exports = {
//     getYTSongInfo
// }

const youtubedl = require('youtube-dl-exec');

async function getYTSongVideo(songTitle) {
    try {
        // Use ytsearch to retrieve a single video (not playlists)
        const result = await youtubedl(`ytsearch:${songTitle}`, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            flatPlaylist: true // Ensures it does not fetch playlist details
        });

        if (!result || !result.entries || result.entries.length === 0) {
            throw new Error(`No video results found for "${songTitle}"`);
        }

        // Get the first valid video result
        const video = result.entries[0];
        console.log(`Found video: ${video.title} (${video.url})`);

        // Extract the best audio URL for the video
        const audioDetails = await youtubedl(video.url, {
            getUrl: true, // Directly fetch audio URL
            format: "bestaudio" // Ensure the best available audio format
        });

        console.log(`Audio URL: ${audioDetails}`);
        return [audioDetails, video.url];

    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw new Error("Failed to fetch song audio URL.");
    }
}

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
    extractVideoId
};