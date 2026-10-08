import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateCustomersQuery,
    validateIdParam,
    validateUpdateCustomer,
} from '../middlewares/validations'
import { Role } from '../models/user'

const customerRouter = Router()

customerRouter.use(auth, roleGuardMiddleware(Role.Admin))

customerRouter.get('/', validateCustomersQuery, getCustomers)
customerRouter.get('/:id', validateIdParam, getCustomerById)
customerRouter.patch(
    '/:id',
    validateIdParam,
    validateUpdateCustomer,
    updateCustomer
)
customerRouter.delete('/:id', validateIdParam, deleteCustomer)

export default customerRouter
