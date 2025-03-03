const { fetchYoutubeAudio } = require('./utils/youtubeUtils'); // Replace with the actual module filename

async function testFetchYoutubeAudio() {
    console.log("Testing fetchYoutubeAudio function...\n");

    // // Test case 1: Fetch using video_id
    // const testData1 = {
    //     video_id: "dQw4w9WgXcQ" // Replace with an actual video ID
    // };
    
    // console.log("Test Case 1: Fetch using video_id");
    // const result1 = await fetchYoutubeAudio(testData1);
    // console.log("Result:", result1, "\n");

    // Test case 2: Fetch using title and artist_name
    const testData2 = {
        title: "Never Gonna Give You Up",
        artist_name: "Rick Astley"
    };
    
    console.log("Test Case 2: Fetch using title and artist_name");
    const result2 = await fetchYoutubeAudio(testData2);
    console.log("Result:", result2, "\n");

    // Final result
    console.log("Test completed.");
}

testFetchYoutubeAudio().catch(error => {
    console.error("Test encountered an error:", error);
});