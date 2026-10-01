import { NextFunction, Request, Response } from 'express'
import { unlink } from 'fs/promises'
import { constants } from 'http2'
import { basename } from 'path'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'
import { MIN_FILE_SIZE } from '../middlewares/file'

const removeFile = (path?: string) =>
    path ? unlink(path).catch(() => undefined) : Promise.resolve()

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    try {
        if (req.file.size < MIN_FILE_SIZE) {
            throw new BadRequestError(
                `Файл слишком маленький, минимальный размер - ${MIN_FILE_SIZE} байт`
            )
        }

        const metadata = await sharp(req.file.path).metadata()
        if (!metadata.format || !metadata.width || !metadata.height) {
            throw new BadRequestError('Файл не является изображением')
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file.filename}`

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: basename(req.file.originalname),
        })
    } catch (error) {
        await removeFile(req.file.path)

        if (error instanceof BadRequestError) {
            return next(error)
        }
        return next(new BadRequestError('Не удалось обработать изображение'))
    }
}

export default {}
