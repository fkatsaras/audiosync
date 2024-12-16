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

async function getYTSongInfo(songTitle) {
    try {
        // Fetch video details
        const output = await youtubedl(
            `ytsearch1:${songTitle}`, // Use "ytsearch1" for top result
            {
                dumpSingleJson: true,
                noWarnings: true,
                noCheckCertificate: true,
                preferFreeFormats: true
            }
        );

        if (!output || !output.entries || output.entries.length === 0) {
            throw new Error(`No results found for "${songTitle}"`);
        }

        // Get the best audio URL
        const bestAudio = output.entries[0];
        console.log(`Video found: ${bestAudio.title}`);
        console.log(`Audio URL: ${bestAudio.url}`);

        return bestAudio.url;
    } catch (error) {
        console.error(`Error fetching audio: ${error.message}`);
        throw new Error('Unable to fetch audio from YouTube.');
    }
}

module.exports = {
    getYTSongInfo
};