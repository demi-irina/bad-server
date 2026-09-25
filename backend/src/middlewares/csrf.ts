import { doubleCsrf } from 'csrf-csrf'
import { CSRF_SECRET, REFRESH_TOKEN } from '../config'

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => CSRF_SECRET,
    getSessionIdentifier: (req) =>
        req.cookies?.[REFRESH_TOKEN.cookie.name] ?? '',
    cookieName: '_csrf',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
    },
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'],
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
})

export { doubleCsrfProtection, generateCsrfToken }
