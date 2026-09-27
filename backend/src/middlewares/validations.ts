import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'

// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^(\+\d+)?(?:\s|-?|\(?\d+\)?)+$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

export enum StatusType {
    Cancelled = 'cancelled',
    Completed = 'completed',
    New = 'new',
    Delivering = 'delivering',
}

const objectId = Joi.string().custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) {
        return value
    }
    return helpers.message({ custom: 'Невалидный id' })
})

const pagination = {
    page: Joi.number().integer().min(1).empty(''),
    limit: Joi.number().integer().min(1).empty(''),
}

const search = Joi.string().max(100).empty('')
const sortOrder = Joi.string().valid('asc', 'desc').empty('')

export const validateOrdersQuery = celebrate({
    query: Joi.object().keys({
        ...pagination,
        sortField: Joi.string()
            .valid('createdAt', 'totalAmount', 'orderNumber', 'status')
            .empty(''),
        sortOrder,
        status: Joi.string()
            .valid(...Object.values(StatusType))
            .empty(''),
        totalAmountFrom: Joi.number().empty(''),
        totalAmountTo: Joi.number().empty(''),
        orderDateFrom: Joi.date().iso().empty(''),
        orderDateTo: Joi.date().iso().empty(''),
        search,
    }),
})

export const validateUserOrdersQuery = celebrate({
    query: Joi.object().keys({
        ...pagination,
        search,
    }),
})

export const validateCustomersQuery = celebrate({
    query: Joi.object().keys({
        ...pagination,
        sortField: Joi.string()
            .valid(
                'createdAt',
                'totalAmount',
                'orderCount',
                'lastOrderDate',
                'name'
            )
            .empty(''),
        sortOrder,
        registrationDateFrom: Joi.date().iso().empty(''),
        registrationDateTo: Joi.date().iso().empty(''),
        lastOrderDateFrom: Joi.date().iso().empty(''),
        lastOrderDateTo: Joi.date().iso().empty(''),
        totalAmountFrom: Joi.number().empty(''),
        totalAmountTo: Joi.number().empty(''),
        orderCountFrom: Joi.number().integer().empty(''),
        orderCountTo: Joi.number().integer().empty(''),
        search,
    }),
})

export const validateProductsQuery = celebrate({
    query: Joi.object().keys({ ...pagination }),
})

const orderNumberParam = Joi.object().keys({
    orderNumber: Joi.number().integer().min(1).required(),
})

export const validateOrderNumber = celebrate({ params: orderNumberParam })

export const validateOrderStatusUpdate = celebrate({
    params: orderNumberParam,
    body: Joi.object().keys({
        status: Joi.string()
            .valid(...Object.values(StatusType))
            .required(),
    }),
})

// валидация id
export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(objectId)
            .messages({
                'array.empty': 'Не указаны товары',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Не указан email',
        }),
        phone: Joi.string().required().pattern(phoneRegExp).messages({
            'string.empty': 'Не указан телефон',
        }),
        address: Joi.string().required().messages({
            'string.empty': 'Не указан адрес',
        }),
        total: Joi.number().required().messages({
            'string.empty': 'Не указана сумма заказа',
        }),
        comment: Joi.string().optional().allow(''),
    }),
})

// валидация товара.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string().required().messages({
            'string.empty': 'Поле "category" должно быть заполнено',
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Поле "description" должно быть заполнено',
        }),
        price: Joi.number().allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }),
        category: Joi.string(),
        description: Joi.string(),
        price: Joi.number().allow(null),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({ productId: objectId.required() }),
})

export const validateIdParam = celebrate({
    params: Joi.object().keys({ id: objectId.required() }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        password: Joi.string().min(6).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.required': 'Поле "email" должно быть заполнено',
            }),
        password: Joi.string().required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
    }),
})
