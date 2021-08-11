// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { AddressWard } from '../../entity/AddressWard';


@Controller("/customer/addressWard")
@Docs("docs_customer")
export class AddressWardController {
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
        @QueryParams("parentCode") parentCode: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const [addressWard, total] = await AddressWard.createQueryBuilder('ward')
            .where(`ward.name LIKE "%${search}%" AND ward.parentCode = "${parentCode}"`)
            .skip((page - 1) * limit)
            .take(limit)
            .addOrderBy('ward.id', 'DESC')
            .getManyAndCount()
        return res.sendOK({ data: addressWard, total })
    }


} // END FILE
