import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    const root = path.resolve(baseDir)

    return (req: Request, res: Response, next: NextFunction) => {
        const filePath = path.resolve(root, `.${req.path}`)
        if (!filePath.startsWith(root + path.sep)) {
            return next()
        }

        return fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return next()
            }
            res.setHeader('Cache-Control', 'public, max-age=86400, immutable')

            return res.sendFile(filePath, (sendErr) => {
                if (sendErr) {
                    next(sendErr)
                }
            })
        })
    }
}
