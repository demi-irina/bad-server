import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import auth from '../middlewares/auth'
import {
    validateCustomersQuery,
    validateIdParam,
} from '../middlewares/validations'

const customerRouter = Router()

customerRouter.get('/', auth, validateCustomersQuery, getCustomers)
customerRouter.get('/:id', auth, validateIdParam, getCustomerById)
customerRouter.patch('/:id', auth, validateIdParam, updateCustomer)
customerRouter.delete('/:id', auth, validateIdParam, deleteCustomer)

export default customerRouter
