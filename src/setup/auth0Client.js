import http from 'k6/http'
import { SharedArray } from 'k6/data'

// Preload tokens for all users
const users = JSON.parse(open('variables/user-data.json')).users

const tokenCache = new SharedArray('tokenCache', () => {
  const cache = new Map()
  users.forEach((user) => {
    const payload = {
      client_id: __ENV.AUTH0_CLIENT_ID,
      client_secret: __ENV.AUTH0_CLIENT_SECRET,
      audience: __ENV.AUTH0_AUDIENCE,
      grant_type: 'password',
      username: user.username,
      password: user.password,
      scope: 'openid profile email offline_access',
    }

    const url = `https://${__ENV.AUTH0_DOMAIN}/oauth/token`
    const headers = { 'Content-Type': 'application/json' }

    const res = http.post(url, JSON.stringify(payload), { headers })

    if (res.status === 200) {
      const response = res.json()
      if (response.access_token) {
        cache.set(user.username, response.access_token)
      } else {
        throw new Error(`No access token in response for user: ${user.username}`)
      }
    } else {
      throw new Error(`Failed to retrieve token for user ${user.username}: ${res.body}`)
    }
  })
  return Array.from(cache.entries())
})

// Convert SharedArray back to a Map for easy access
const sharedTokenCache = new Map(tokenCache)

export function getAccessToken(username) {
  const token = sharedTokenCache.get(username)
  if (!token) {
    throw new Error(`Token not found for user: ${username}`)
  }
  return token
}
