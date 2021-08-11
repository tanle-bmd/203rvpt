// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { Util } from '../../entity/Util';
import { MultipartFile } from '@tsed/multipartfiles';
import Jimp from 'jimp';
import CONFIG from '../../../config';


@Controller("/admin/util")
@Docs("docs_admin")
export class UtilController {
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
        @Req() req: Request,
        @Res() res: Response
    ) {
        const [utils, total] = await Util.createQueryBuilder('util')
            .where(`util.name LIKE "%${search}%" AND util.isDeleted = false `)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('util.id', 'DESC')
            .getManyAndCount()

        return res.sendOK({ utils, total });
    }


    // =====================CREATE ITEM=====================
    @Post('')
    @UseAuth(VerificationJWT)
    @Validator({
        util: Joi.required(),
    })
    async create(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("util") util: Util,
    ) {
        await util.save()
        return res.sendOK(util)
    }


    // =====================UPDATE ITEM=====================
    @Post('/:utilId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        util: Joi.required(),
        utilId: Joi.number().required()
    })
    async update(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("util") util: Util,
        @PathParams("utilId") utilId: number,
    ) {
        await Util.findOneOrThrowId(utilId)
        util.id = +utilId
        await util.save()

        return res.sendOK(util)
    }


    // =====================UPLOAD IMAGE=====================
    @Post('/upload')
    @UseAuth(VerificationJWT)
    async uploadFile(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @MultipartFile('file') file: Express.Multer.File,
    ) {
        const image = await Jimp.read(file.path)
        image.resize(700, Jimp.AUTO);
        image.quality(80)
        image.writeAsync(file.path)

        file.path = file.path.replace(CONFIG.UPLOAD_DIR, '');

        return res.sendOK(file)
    }


    // =====================DELETE=====================
    @Post('/:utilId/delete')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async delete(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("utilId") utilId: number,
    ) {
        let util = await Util.findOneOrThrowId(utilId)
        util.isDeleted = true
        await util.save()
        return res.sendOK(util)
    }

} // END FILE
