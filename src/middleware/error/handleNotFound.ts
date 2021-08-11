import { Request, Response, NextFunction } from 'express';
import { NotFound } from 'ts-httpexceptions'

export default function handleNotFound(req: Request, res: Response, next: NextFunction) {
    const error = new NotFound(`The request ${req.method}: ${req.url} was not found on this server.`)
    next(error)
}
