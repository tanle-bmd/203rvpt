// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { AddressWard } from '../../entity/AddressWard';


@Controller("/admin/addressWard")
@Docs("docs_admin")
export class AddressWardController {
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


    // =====================UPDATE ITEM=====================
    @Post('/:addressWardId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        addressWard: Joi.required(),
        addressWardId: Joi.number().required()
    })
    async update(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("addressWard") addressWard: AddressWard,
        @PathParams("addressWardId") addressWardId: number,
    ) {
        // This will check and throw error if not exist 
        await AddressWard.findOneOrThrowId(addressWardId)
        addressWard.id = +addressWardId
        await addressWard.save()
        return res.sendOK(addressWard)
    }


} // END FILE
