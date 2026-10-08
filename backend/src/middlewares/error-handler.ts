import { ErrorRequestHandler } from 'express'
import { Error as MongooseError } from 'mongoose'

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    let statusCode: number = err.statusCode ?? err.status ?? 500
    let { message } = err as { message: string }

    if (err instanceof MongooseError.CastError) {
        statusCode = 400
        message = 'Передан невалидный идентификатор'
    }

    if (err instanceof MongooseError.ValidationError) {
        statusCode = 400
    }

    if (statusCode >= 500) {
        console.error(err)
        message = 'На сервере произошла ошибка'
    }

    res.status(statusCode).send({ message })
}

export default errorHandler
