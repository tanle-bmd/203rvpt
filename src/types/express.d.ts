import { ErrorRequestHandler, Response, Request } from 'express';

import { Customer } from '../entity/Customer';
import { Staff } from '../entity/Staff';
// import { Driver } from '../entity/Driver';
import { AuthType } from '../middleware/auth/strategy/JWT';
export { }
declare global {

    namespace NodeJS {
        interface EventEmitter {
        }
    }
    namespace Express {

        interface ErrorRequestHandler {
            statusCode?: number
        }

        interface Request {
            staff: Staff,
            customer: Customer,
            // driver: Driver,
            authType: AuthType
        }

        interface Response {
            /**
            * Gui response voi status code 200
            * @param {Array<object> | object} data
            * @param {string} message
            */
            sendOK(data: Array<object> | object,
                message?: string): void

            /**
            * Gui response voi status code 201
            * @param {Array<object> | object} data
            * @param {string} message
            */
            sendCreated(message: string,
                data?: Array<object> | object): void

            /**
            * Gui response voi status code 400
            * @param {string} message
            * @param {Array<object> | object} data
            */
            sendClientError(message: string,
                data?: Array<object> | object): void

            /**
            * Gui response voi status code 401
            * @param {string} message
            * @param {Array<object> | object} data
            */
            sendUnauthorized(message: string,
                data?: Array<object> | object): void

            /**
            * Gui response voi status code 403
            * @param {string} message
            * @param {Array<object> | object} data
            */
            sendForbidden(message: string,
                data?: Array<object> | object): void

            /**
            * Gui response voi status code 200
            * @param {string} message
            * @param {Array<object> | object} data
            */
            sendNotFound(message: string,
                data?: Array<object> | object): void

            /**
            * Gui response voi status code 500
            * @param {string} message
            * @param {Array<object> | object} data
            */
            sendFail(message: string,
                data?: Array<object> | object): void

            /**
            * Gui response json
            * @param {Array<object> | object} data
            * @param {string} message
            * @param {boolean} status
            * @param {number} code
            */
            sendAPI(data: Array<object> | object,
                message: string,
                status: boolean,
                code: number): void
        }
    }
}
