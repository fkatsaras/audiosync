const axios = require('axios');
const pLimit = require('p-limit');
const limit = pLimit.default(5)  // Max 5 concurrent Spotify requests to avoid overwhelming the API

async function getSpotifyToken() {
  try {
    const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 5000, // Timeout in milliseconds
      }
    );

    if (response.status === 200) {
      return response.data.access_token;
    } else {
      console.error(`Failed to get token: ${response.status}, ${response.data}`);
      return null;
    }
  } catch (error) {
    console.error('Error while fetching Spotify token:', error);
    return null;
  }
}

/**
 * Get artist data from Spotify by name.
 *
 * @param {string} artistName Artist name to search for.
 * @returns {Promise<Object|null>} Artist data or null if not found.
 */
async function getArtistProfilePicture(artistName) {
  try {
    const token = await getSpotifyToken();
    
    if (!token) {
      throw new Error('Failed to retrieve Spotify token');
    }

    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`;
    const response = await axios.get(searchUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 5000, // Timeout in milliseconds
    });

    const artists = response.data.artists.items;

    if (artists && artists.length > 0) {
      // Return the URL of the largest image
      return artists[0].images[0]?.url || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error while fetching artist profile picture:', error);
    return null;
  }
}

/**
 * Get song data from Spotify by album name.
 *
 * @param {string} albumName Artist name to search for.
 * @returns {Promise<Object|null>} Song data or null if not found.
 */
async function getSongCover(albumName) {
    try {
        const token = await getSpotifyToken();

        if(!token) {
            throw new Error('Failed to retrieve Spotify token.');
        }

        const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`
        const response = await axios.get(searchUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            timeout: 5000, // Timeout in milliseconds
        });

        const albums = response.data.albums.items;

        if(albums && albums.length > 0) {
            return albums[0].images[0]?.url || null
        } else {
            return null;
        }   
    } catch (error) {
        console.error('Error while fetching song album cover:', error);
        return null;
    }
}

async function getSongCoverBatch(albumNames) {
  const token = await getSpotifyToken();
  if(!token) {
    throw new Error('Failed to retrieve Spotify token.');
  }

  const albumQueries = albumNames.map(name => `album:${encodeURIComponent(name)}`).join(' OR ');
  const searchUrl = `https://api.spotify.com/v1/search?q=${albumQueries}&type=album&limit=50`;

  const response = await limit(() => 
    axios.get(searchUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000,
    })
  );

  const covers = {};
  console.log(response);
  response.data.albums.items.forEach(album => {
    covers[album.name.toLowerCase()] = album.images[0]?.url || null;
  });

  console.log(covers);

  return covers;  // Object with album names as keys and cover URLs as values  
}

module.exports = {
    getArtistProfilePicture,
    getSpotifyToken,
    getSongCover,
    getSongCoverBatch,
}
