import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateIdParam,
    validateOrderBody,
    validateOrderNumber,
    validateOrderStatusUpdate,
    validateOrdersQuery,
    validateUserOrdersQuery,
} from '../middlewares/validations'
import { Role } from '../models/user'

const orderRouter = Router()

orderRouter.post('/', auth, validateOrderBody, createOrder)
orderRouter.get(
    '/all',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateOrdersQuery,
    getOrders
)
orderRouter.get('/all/me', auth, validateUserOrdersQuery, getOrdersCurrentUser)
orderRouter.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateOrderNumber,
    getOrderByNumber
)
orderRouter.get(
    '/me/:orderNumber',
    auth,
    validateOrderNumber,
    getOrderCurrentUserByNumber
)
orderRouter.patch(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateOrderStatusUpdate,
    updateOrder
)

orderRouter.delete(
    '/:id',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateIdParam,
    deleteOrder
)

export default orderRouter
