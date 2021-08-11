// IMPORT LIBRARY
import { Request } from 'express';
import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, Post, BodyParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { MultipartFile } from '@tsed/multipartfiles';

// IMPORT CUSTOM
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import CONFIG from '../../../config';

@Controller("/customer/customer")
@Docs("docs_customer")
export class CustomerController {

    constructor() { }


    // =====================UPLOAD IMAGE=====================
    @Post('/upload')
    @UseAuth(VerificationJWT)
    uploadFile(
        @HeaderParams("version") version: string,
        @HeaderParams('token') token: string,
        @Res() res: Response,
        @MultipartFile('file') file: Express.Multer.File,
    ) {
        file.path = file.path.replace(CONFIG.UPLOAD_DIR, '');
        return res.sendOK(file)
    }

} // END FILE
