// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { AddressDistrict } from '../../entity/AddressDistrict';


@Controller("/admin/addressDistrict")
@Docs("docs_admin")
export class AddressDistrictController {
    constructor() { }


    // =====================GET LIST=====================
    @Get('')
    @UseAuth(VerificationJWT)
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


    // =====================UPDATE ITEM=====================
    @Post('/:addressDistrictId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        addressDistrict: Joi.required(),
        addressDistrictId: Joi.number().required()
    })
    async update(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("addressDistrict") addressDistrict: AddressDistrict,
        @PathParams("addressDistrictId") addressDistrictId: number,
    ) {
        await AddressDistrict.findOneOrThrowId(addressDistrictId)
        addressDistrict.id = +addressDistrictId
        await addressDistrict.save()
        return res.sendOK(addressDistrict)
    }

} // END FILE
