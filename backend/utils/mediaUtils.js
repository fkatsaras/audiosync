const fetch = require('node-fetch'); 
const btoa = require('btoa'); // For base64 encoding

async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Spotify client ID and secret are required.');
    return null;
  }

  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials); // Base64 encode the credentials

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const headers = {
    'Authorization': `Basic ${encodedCredentials}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const body = new URLSearchParams();
  body.append('grant_type', 'client_credentials');

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: headers,
      body: body.toString(),
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token; // Return the access token
    } else {
      console.error(`Failed to get token: ${response.status}, ${await response.text()}`);
      return null; // Return null if the request fails
    }
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return null;
  }
}

async function getArtistProfilePicture(artistName) {
  try {
    const token = await get_spotify_token(); // Retrieve Spotify token
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch artist data');
    }

    const data = await response.json();
    const artists = data.artists.items;

    if (artists.length > 0) {
      return artists[0].images[0].url; // Return the largest image URL
    } else {
      return null; // If no artist is found
    }
  } catch (error) {
    console.error('Error fetching artist profile picture:', error);
    return null; // Return null on error
  }
}

module.exports = { getSpotifyToken, getArtistProfilePicture };
