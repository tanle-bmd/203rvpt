import { Request, Response, NextFunction } from "express";
import { BadRequest, Unauthorized, Forbidden, InternalServerError } from "ts-httpexceptions"

export default function responseAPI(req: Request, res: Response, next: NextFunction) {
    res.sendAPI = (
        data: Array<object> | object = {},
        message: string = "",
        status: boolean = true,
        code: number = 200
    ) => {
        res.status(code)
            .send({
                data,
                message,
                status
            })
    }

    res.sendOK = (
        data: Array<object> | object = {},
        message: string = ""
    ) => {
        const status = true
        return res.sendAPI(data, message, status, 200)
    }

    res.sendCreated = (
        message: string = "Created successfully!",
        data: Array<object> | object = {}
    ) => {
        const status = true
        return res.sendAPI(data, message, status, 201)
    }

    res.sendClientError = (
        message: string = "Bad Request",
        data: Array<object> | object = {}
    ) => {
        const err = new BadRequest(message)
        next(err)
    }

    res.sendUnauthorized = (
        message: string = "Unauthorized",
        data: Array<object> | object = {}
    ) => {
        const err = new Unauthorized(message)
        next(err)
    }

    res.sendForbidden = (
        message: string = "Forbidden",
        data: Array<object> | object = {}
    ) => {
        const err = new Forbidden(message)
        next(err)
    }

    res.sendNotFound = (
        message: string = "Not Found",
        data: Array<object> | object = {}
    ) => {
        const status = false
        return res.sendAPI(data, message, status, 200)
    }

    res.sendFail = (
        message: string = "Internal Server Error",
        data: Array<object> | object = {}
    ) => {
        const err = new InternalServerError(message)
        next(err)
    }

    next()
}
