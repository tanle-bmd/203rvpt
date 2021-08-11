// IMPORT LIBRARY
import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, QueryParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Notification, NotificationType } from '../../entity/Notification';


@Controller("/customer/notification")
@Docs("docs_customer")
export class NotificationController {
    constructor() { }


    // =====================GET LIST=====================
    @Get('')
    @UseAuth(VerificationJWT)
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findAll(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @QueryParams("type") type: NotificationType,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `notification.isDeleted = false `
        if (type) {
            where += ` AND notification.type = '${type}'`
        }

        const [notifications, total] = await Notification.createQueryBuilder('notification')
            .leftJoinAndSelect('notification.post', 'post')
            .leftJoinAndSelect('notification.news', 'news')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('notification.id', 'DESC')
            .getManyAndCount()

        return res.sendOK({ notifications, total });
    }

} // END FILE
