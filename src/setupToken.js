import http from 'k6/http';

// Function to fetch a token for a user
function fetchToken(user) {
    const payload = {
        client_id: __ENV.AUTH0_CLIENT_ID,
        client_secret: __ENV.AUTH0_CLIENT_SECRET,
        audience: __ENV.AUTH0_AUDIENCE,
        grant_type: 'password',
        username: user.username,
        password: user.password,
        scope: 'openid profile email offline_access',
    };

    const url = `https://${__ENV.AUTH0_DOMAIN}/oauth/token`;
    const headers = { 'Content-Type': 'application/json' };

    const res = http.post(url, JSON.stringify(payload), { headers });

    if (res.status === 200) {
        const response = res.json();
        const { access_token: accessToken, expires_in: expiresIn, id_token: idToken } = response;

        if (response.access_token) {
            return {
                accessToken,
                expiresIn,
                idToken,
            };
        } else {
            throw new Error(`No access token in response for user: ${user.username}`);
        }
    } else {
        throw new Error(`Failed to retrieve token for user ${user.username}: ${res.body}`);
    }
}

// Function to preload tokens for all users
export function setupTokens(users) {
    const tokenCache = {};
    users.forEach((user) => {
        tokenCache[user.username] = fetchToken(user);
    });
    return tokenCache; // Return the token cache
}