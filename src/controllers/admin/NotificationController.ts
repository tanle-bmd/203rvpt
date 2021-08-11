// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { Notification, NotificationType } from '../../entity/Notification';
import { getCurrentTimeInt } from '../../util/helper';


@Controller("/admin/notification")
@Docs("docs_admin")
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
        @QueryParams("search") search: string = "",
        @QueryParams("type") type: NotificationType,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `notification.title LIKE "%${search}%" AND notification.isDeleted = false `
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


    // =====================CREATE ITEM=====================
    @Post('')
    @UseAuth(VerificationJWT)
    @Validator({
        notification: Joi.required(),
    })
    async create(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("notification") notification: Notification,
        @BodyParams('postId') postId: number,
        @BodyParams('newsId') newsId: number,
    ) {
        if (postId) {
            notification.type = NotificationType.Post
            await notification.assignPost(postId)
        }

        if (newsId) {
            notification.type = NotificationType.News
            await notification.assignNews(newsId)
        }

        await notification.save()
        return res.sendOK(notification)
    }


    // =====================UPDATE ITEM=====================
    @Post('/:notificationId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        notification: Joi.required(),
        notificationId: Joi.number().required()
    })
    async update(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("notification") notification: Notification,
        @PathParams("notificationId") notificationId: number,
        @BodyParams('postId') postId: number,
        @BodyParams('newsId') newsId: number,
    ) {
        await Notification.findOneOrThrowId(notificationId)
        notification.id = +notificationId

        if (postId) {
            notification.type = NotificationType.Post
            await notification.assignPost(postId)
        }

        if (newsId) {
            notification.type = NotificationType.News
            await notification.assignNews(newsId)
        }

        await notification.save()

        return res.sendOK(notification)
    }


    // =====================UPDATE ITEM=====================
    @Post('/:notificationId/publish')
    @UseAuth(VerificationJWT)
    @Validator({
        notificationId: Joi.number().required()
    })
    async publish(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("notificationId") notificationId: number,
    ) {
        const notification = await Notification.findOneOrThrowId(notificationId)
        notification.publishAt = getCurrentTimeInt()
        notification.save()

        // Push notification


        return res.sendOK(notification)
    }


    // =====================DELETE=====================
    @Post('/:notificationId/delete')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async delete(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("notificationId") notificationId: number,
    ) {
        let notification = await Notification.findOneOrThrowId(notificationId)
        notification.isDeleted = true
        await notification.save()
        return res.sendOK(notification)
    }

} // END FILE
