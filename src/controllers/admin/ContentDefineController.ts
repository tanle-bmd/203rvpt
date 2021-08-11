import { ContentDefineService } from './../../services/ContentDefineService';
import { Controller, Post, UseAuth, Res, Response, HeaderParams, BodyParams, Get, PathParams, Req, Request } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { ContentDefine, ContentDefineType } from '../../entity/ContentDefine';
import faker from 'faker'
import { MultipartFile } from '@tsed/multipartfiles';
import CONFIG from '../../../config';


@Controller("/admin/contentDefine")
@Docs("docs_admin")
export class ContentDefineController {
    constructor(
        private contentDefineService: ContentDefineService
    ) { }


    // =====================GET LIST=====================
    @Get('')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async findAll(
        @HeaderParams("token") token: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const contentDefines = await ContentDefine.find()

        return res.sendOK(contentDefines)
    }


    // =====================UPDATE ITEM=====================
    @Post('/:contentDefineId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        contentDefine: Joi.required(),
    })
    async update(
        @HeaderParams('token') token: string,
        @Res() res: Response,
        @Req() req: Request,
        @BodyParams("contentDefine") contentDefine: ContentDefine,
        @PathParams("contentDefineId") contentDefineId: number,
    ) {
        await ContentDefine.findOneOrThrowId(+contentDefineId)
        contentDefine.id = contentDefineId
        await contentDefine.save()

        return res.sendOK(contentDefine)
    }


    // =====================INIT=====================
    @Post('/init')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async init(
        @HeaderParams("token") token: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        await ContentDefine.delete({})
        this.contentDefineService.initContentDefine(ContentDefineType.About, 'Giới thiệu', faker.random.words(100))
        this.contentDefineService.initContentDefine(ContentDefineType.Faq, 'Câu hỏi thường gặp', faker.random.words(100))
        this.contentDefineService.initContentDefine(ContentDefineType.Security, 'Bảo mật', faker.random.words(100))
        this.contentDefineService.initContentDefine(ContentDefineType.HowToUse, 'Hướng dẫn sử dụng', faker.random.words(100))
        this.contentDefineService.initContentDefine(ContentDefineType.TermCondition, 'Điều khoản sử dụng', faker.random.words(100))
        return res.sendOK({}, 'Init success')
    }


    // =====================UPLOAD IMAGE=====================
    @Post('/upload')
    @UseAuth(VerificationJWT)
    uploadFile(
        @HeaderParams('token') token: string,
        @Res() res: Response,
        @Req() req: Request,
        @MultipartFile('file') file: Express.Multer.File,
    ) {
        file.path = file.path.replace(CONFIG.UPLOAD_DIR, '');
        return res.sendOK(file);
    }

} // END FILE
