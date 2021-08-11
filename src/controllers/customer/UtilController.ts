// IMPORT LIBRARY
import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, QueryParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Util } from '../../entity/Util';


@Controller("/customer/util")
@Docs("docs_customer")
export class UtilController {
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
        @Req() req: Request,
        @Res() res: Response
    ) {
        const [utils, total] = await Util.createQueryBuilder('util')
            .where(`util.isDeleted = false `)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('util.id', 'DESC')
            .getManyAndCount()

        return res.sendOK({ utils, total });
    }

} // END FILE
