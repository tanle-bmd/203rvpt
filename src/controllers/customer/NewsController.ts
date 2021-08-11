// IMPORT LIBRARY
import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, QueryParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { News } from '../../entity/News';


@Controller("/customer/news")
@Docs("docs_customer")
export class NewsController {
    constructor() { }


    // =====================GET LIST=====================
    @Get('')
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findAll(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @QueryParams("search") search: string = "",
        @QueryParams('isHighLight') isHighLight: boolean,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `news.isDeleted = false `

        if (isHighLight == true) {
            where += ` AND news.isHighlight = true`
        }

        const [newss, total] = await News.createQueryBuilder('news')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('news.id', 'DESC')
            .getManyAndCount()

        return res.sendOK({ newss, total });
    }

} // END FILE
