// IMPORT LIBRARY
import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, Post, BodyParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { StaffService } from '../../services/StaffService';
import JWT, { AuthType } from '../../middleware/auth/strategy/JWT';
import { Staff } from '../../entity/Staff';
import { isNumberPhoneVN } from '../../util/helper';
import { Customer } from '../../entity/Customer';


@Controller("/admin/auth")
@Docs("docs_admin")
export class AuthController {
    constructor(
        private staffService: StaffService,
    ) { }


    // =====================LOGIN=====================
    @Post('/login')
    @Validator({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
    async login(
        @BodyParams('username') username: string,
        @BodyParams('password') password: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const staff = await this.staffService.login(username, password);
        const token = JWT.sign({ id: staff.id, type: AuthType.Staff });

        return res.sendOK({ token })
    }


    // =====================CHECK PHONE=====================
    @Post('/mail/exist')
    async checkMail(
        @BodyParams('mail') mail: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const customer = await Customer.findOne({
            where: { mail }
        })

        return customer ? res.sendOK({ isExist: true }) : res.sendOK({ isExist: false })
    }


    // =====================CHECK PHONE=====================
    @Post('/phone/exist')
    async check(
        @BodyParams('phone') phone: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        if (!isNumberPhoneVN(phone)) {
            return res.sendClientError('Số điện thoại không đúng định dạng')
        }

        const customer = await Customer.findOne({
            where: { phone }
        })

        return customer ? res.sendOK({ isExist: true }) : res.sendOK({ isExist: false })
    }

    // =====================PROFILE=====================
    @Get('/profile')
    @UseAuth(VerificationJWT)
    async getInfo(
        @Req() req: Request,
        @Res() res: Response,
        @HeaderParams("token") token: string,
    ) {
        const staff = await Staff.findOneOrThrowId(req.staff.id, {
            relations: ['role.permissions', 'role']
        });

        return res.sendOK(staff)
    }


    // =====================UPDATE PASSWORD=====================
    @Post('/password/update')
    @UseAuth(VerificationJWT)
    @Validator({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    })
    async changePassword(
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams('oldPassword') oldPassword: string,
        @BodyParams('newPassword') newPassword: string,
        @HeaderParams("token") token: string,
    ) {
        const { staff } = req;

        await this.staffService.changePassword({ staff, oldPassword, newPassword })

        return res.sendOK(staff, 'Cập nhật mật khẩu thành công');
    }


    // =====================GET PERMISSION=====================
    @Get('/profile/permission')
    @UseAuth(VerificationJWT)
    async getPermission(
        @Req() req: Request,
        @Res() res: Response,
        @HeaderParams("token") token: string,
    ) {
        const { id } = req.staff;
        const permissions = await this.staffService.getPermission(id);

        return res.sendOK(permissions);
    }


} // END FILE
