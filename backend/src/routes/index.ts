import { NextFunction, Request, Response, Router } from 'express'
import { getCsrfTokenHandler } from '../controllers/auth'
import NotFoundError from '../errors/not-found-error'

import auth from '../middlewares/auth'
import { doubleCsrfProtection } from '../middlewares/csrf'
import rateLimit from '../middlewares/rate-limit'
import authRouter from './auth'
import customerRouter from './customers'
import orderRouter from './order'
import productRouter from './product'
import uploadRouter from './upload'

const router = Router()

router.get('/auth/csrf-token', getCsrfTokenHandler)

router.use(rateLimit())

router.use(doubleCsrfProtection)

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/order', auth, orderRouter)
router.use('/upload', auth, uploadRouter)
router.use('/customers', auth, customerRouter)

router.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError('Маршрут не найден'))
})

export default router
