/**
 * prepare-ytdl.js - Prepares the yt-dlp binary for deployment on Vercel.
 *
 * This script:
 *  - Ensures the youtube-dl-exec bin directory exists.
 *  - Downloads the latest yt-dlp binary from the official repository.
 *  - Grants execute permissions to the downloaded binary.
 *  - Outputs relevant status messages.
 *
 * Dependencies:
 *  - Node.js
 *  - curl (for downloading the binary)
 *
 * Usage:
 *  Simply run the script using Node.js:
 *    $ node prepare-ytdl.js
 *
 * Notes:
 *  - The script checks the VERCEL environment variable to determine execution.
 *  - The downloaded binary is stored in the node_modules/youtube-dl-exec/bin directory.
 *
 * Author: fkatsaras
 * License: GNU License
 */

const fs = require("fs");
const path = require('path');
const { execSync } = require('child-process');

// Prepare the yt-dl library for Vercel deployment
if (process.env.VERCEL) {
    function prepareYoutubeDL() {
        const binPath = path.join(__dirname, "../node_modules/youtube-dl-exec/bin");

        if (!fs.existsSync(binPath)) {
            fs.mkdirSync(binPath, { recursive: true });
        }

        // Download the latest youtube-dl binary
        const youtubeDLUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";
        const outPath = path.join(binPath, "youtube-dl");

        console.log("Downloading youtube-dl binary for Vercel deployment...");
        execSync(`curl -L ${youtubeDLUrl} -o ${outPath}`);
        execSync(`chmod +x ${outPath}`);
        console.log("youtube-dl binary prepared for Vercel deployment");
    }

    prepareYoutubeDL();
} else {
    console.log("Skipping youtube-dl setup (not running on Vercel).");
}