import expressRateLimit from 'express-rate-limit'
import { RATE_LIMIT } from '../config'

export default function rateLimit(limitMultiplier = 1) {
    return expressRateLimit({
        windowMs: RATE_LIMIT.duration * 1000,
        limit: RATE_LIMIT.points * limitMultiplier,
        skip: () => !RATE_LIMIT.enabled,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: { message: 'Слишком много запросов, попробуйте позже' },
    })
}
