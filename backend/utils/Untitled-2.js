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

// Example test case
console.log(
    isExpired(
        "https://rr2---sn-4vguioxu-n3bl.googlevideo.com/videoplayback?expire=1734412149&ei=FbNgZ4fnM9jwi9oPrJSqsAo&ip=46.12.21.3"
    )
);