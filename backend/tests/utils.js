const got = require('got');
const test = require('ava');
const BASE_URL = `http:localhost`;

const loginRequest = async (credentials, PORT) => {
    return await got.post(`${BASE_URL}:${PORT}/api/v1/users/login`, {
        json: credentials,
        responseType: 'json',
        throwHttpErrors: false,
    });
};

const logoutRequest = async (username, token, PORT) => {
    return await got.post(`${BASE_URL}:${PORT}/api/v1/users/logout`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        json: { username },
        responseType: 'json',
        throwHttpErrors: false
    });
};

const registerRequest = async (userData, PORT) => {
    return await got.post(`${BASE_URL}:${PORT}/api/v1/users/register`, {
        json: userData,
        responseType: 'json',
        throwHttpErrors: false
    });
};

const searchRequest = async ( PORT, token, query, limit = 10, offset = 0) => {
    const URL = `${BASE_URL}:${PORT}/api/v1/search/artists`;

    const options = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'json',
        throwHttpErrors: false
    }

    if (query) {
        options.searchParams = {
            q: query,
            limit,
            offset,
        };
    }
    
    return await got(URL, options);
};


module.exports = {
    loginRequest,
    logoutRequest,
    registerRequest,
    searchRequest
}
