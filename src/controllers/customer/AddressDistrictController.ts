// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { AddressDistrict } from '../../entity/AddressDistrict';


@Controller("/customer/addressDistrict")
@Docs("docs_customer")
export class AddressDistrictController {
    constructor() { }


    // =====================GET LIST=====================
    @Get('')
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0),
        parentCode: Joi.string().required(),
    })
    async findAll(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number = 1,
        @QueryParams("limit") limit: number = 0,
        @QueryParams("parentCode") parentCode: string,
        @QueryParams("search") search: string = "",
        @Req() req: Request,
        @Res() res: Response
    ) {
        const [addressDistrict, total] = await AddressDistrict.createQueryBuilder('district')
            .where(`district.name LIKE "%${search}%" AND district.parentCode = "${parentCode}"`)
            .skip((page - 1) * limit)
            .take(limit)
            .addOrderBy('district.id', 'DESC')
            .getManyAndCount()
        return res.sendOK({ data: addressDistrict, total })
    }

} // END FILE
