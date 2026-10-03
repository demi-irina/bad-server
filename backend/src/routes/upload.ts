import { NextFunction, Request, Response, Router } from 'express'
import { MulterError } from 'multer'
import { uploadFile } from '../controllers/upload'
import BadRequestError from '../errors/bad-request-error'
import { roleGuardMiddleware } from '../middlewares/auth'
import fileMiddleware, { MAX_FILE_SIZE } from '../middlewares/file'
import { Role } from '../models/user'

const upload = (req: Request, res: Response, next: NextFunction) =>
    fileMiddleware.single('file')(req, res, (err: unknown) => {
        if (err instanceof MulterError) {
            return next(
                new BadRequestError(
                    err.code === 'LIMIT_FILE_SIZE'
                        ? `Файл слишком большой, максимальный размер - ${MAX_FILE_SIZE} байт`
                        : 'Не удалось загрузить файл'
                )
            )
        }
        return next(err)
    })

const uploadRouter = Router()
uploadRouter.post('/', roleGuardMiddleware(Role.Admin), upload, uploadFile)

export default uploadRouter
