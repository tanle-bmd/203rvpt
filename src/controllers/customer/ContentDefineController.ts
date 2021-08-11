import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, QueryParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';

import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { ContentDefine, ContentDefineType } from '../../entity/ContentDefine';

@Controller("/customer/contentDefine")
@Docs("docs_customer")
export class ContentDefineController {
    constructor() { }


    // =====================GET ITEM=====================
    @Get('')
    @UseAuth(VerificationJWT)
    @Validator({
        type: Joi.string().required()
    })
    async findAll(
        @HeaderParams("token") token: string,
        @QueryParams("type") type: ContentDefineType,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const content = await ContentDefine.findOneOrThrowOption({
            where: { type }
        })
        return res.sendOK(content)
    }
    
} // END FILE
