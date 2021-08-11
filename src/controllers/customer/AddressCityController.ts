// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { AddressCityService } from '../../services/AddressCityService';


@Controller("/customer/addressCity")
@Docs("docs_customer")
export class AddressCityController {
    constructor(
        private addressCityService: AddressCityService,
    ) { }


    // =====================GET LIST=====================
    @Get('')
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async findAll(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number,
        @QueryParams("limit") limit: number,
        @QueryParams("search") search: string = "",
        @Req() req: Request,
        @Res() res: Response
    ) {
        const [addressCity, total] = await this.addressCityService.getManyAndCount({ page, limit, search })
        return res.sendOK({ data: addressCity, total })
    }


} // END FILE
