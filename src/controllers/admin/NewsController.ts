// IMPORT LIBRARY
import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';


// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { News } from '../../entity/News';
import { MultipartFile } from '@tsed/multipartfiles';
import Jimp from 'jimp';
import CONFIG from '../../../config';


@Controller("/admin/news")
@Docs("docs_admin")
export class NewsController {
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
        @QueryParams('isHighLight') isHighLight: boolean,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `news.title LIKE "%${search}%" AND news.isDeleted = false `

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


    // =====================CREATE ITEM=====================
    @Post('')
    @UseAuth(VerificationJWT)
    @Validator({
        news: Joi.required(),
    })
    async create(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("news") news: News,
    ) {
        await news.save()
        return res.sendOK(news)
    }


    // =====================UPDATE ITEM=====================
    @Post('/:newsId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        news: Joi.required(),
        newsId: Joi.number().required()
    })
    async update(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("news") news: News,
        @PathParams("newsId") newsId: number,
    ) {
        await News.findOneOrThrowId(newsId)
        news.id = +newsId
        await news.save()

        return res.sendOK(news)
    }


    // =====================DELETE=====================
    @Post('/:newsId/delete')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async delete(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("newsId") newsId: number,
    ) {
        let news = await News.findOneOrThrowId(newsId)
        news.isDeleted = true
        await news.save()
        return res.sendOK(news)
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

} // END FILE
