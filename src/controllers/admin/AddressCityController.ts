// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { AddressCity } from '../../entity/AddressCity';
import { AddressCityService } from '../../services/AddressCityService';



@Controller("/admin/addressCity")
@Docs("docs_admin")
export class AddressCityController {
    constructor(
        private addressCityService: AddressCityService,
    ) { }


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
        @Req() req: Request,
        @Res() res: Response
    ) {
        const [addressCity, total] = await this.addressCityService.getManyAndCount({ page, limit, search })

        return res.sendOK({ data: addressCity, total })
    }


    // =====================UPDATE ITEM=====================
    @Post('/:addressCityId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        addressCity: Joi.required(),
        addressCityId: Joi.number().required()
    })
    async update(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("addressCity") addressCity: AddressCity,
        @PathParams("addressCityId") addressCityId: number,
    ) {
        // This will check and throw error if not exist 
        await AddressCity.findOneOrThrowId(addressCityId)
        addressCity.id = +addressCityId
        await addressCity.save()
        return res.sendOK(addressCity)
    }



} // END FILE
