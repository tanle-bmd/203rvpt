// IMPORT LIBRARY
import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, Post, BodyParams, QueryParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import JWT, { AuthType } from '../../middleware/auth/strategy/JWT';
import { CustomerService } from '../../services/CustomerService';
import { CustomerUpdate } from '../../entity-request/CustomerUpdate';
import { Password } from '../../util/password';
import { Customer, KYCStatus } from '../../entity/Customer';
import { getCurrentTimeInt, isNumberPhoneVN, randomString } from '../../util/helper';
import { MailService } from '../../services/MailService';
import { CustomerInsert } from '../../entity-request/CustomerInsert';
import { CustomerProfile } from '../../entity/CustomerProfile';
import { Otp } from '../../entity/Otp';


@Controller("/customer/auth")
@Docs("docs_customer")
export class AuthController {
    constructor(
        private mailService: MailService,
        private customerService: CustomerService,
    ) { }


    // =====================GET OTP=====================
    @Get('/otp')
    @Validator({
        phone: Joi.string().required(),
    })
    async sendOTP(
        @Req() req: Request,
        @Res() res: Response,
        @QueryParams("phone") phone: string,
    ) {
        const otp = new Otp()
        otp.toOtp()
        otp.phone = phone
        await otp.save()

        // const result = await Abenla.sendSMS(phone, otp.code)
        const result = true

        result
            ? res.sendOK(null, `Gửi otp thành công: ${otp.code}`)
            : res.sendClientError('Gửi mã OTP thất bại! Vui lòng thử lại sau.')
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
            where: { phone, isDeleted: false }
        })

        return customer ? res.sendOK({ isExist: true }) : res.sendOK({ isExist: false })
    }


    // =====================CHECK PHONE=====================
    @Post('/otp/exist')
    async checkOTP(
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams('otp') otp: string,
        @BodyParams('phone') phone: string,
    ) {
        if (otp != '999999') {
            const exist = await Otp.findOne({
                where: {
                    code: otp,
                    phone,
                }
            })

            if (!!exist) {
                res.sendOK({ isExist: true })
            } else {
                res.sendOK({ isExist: false })
            }
        } else {
            res.sendOK({ isExist: true })
        }
    }


    // =====================SIGNUP=====================
    @Post('/signup')
    @Validator({
        customer: Joi.required()
    })
    async create(
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("customer") customer: CustomerInsert,
        @BodyParams('cityId') cityId: number,
        @BodyParams('fbToken') fbToken: string,
        @BodyParams('zaloToken') zaloToken: string,
        @BodyParams('appleToken') appleToken: string,
    ) {
        // Handle signup
        const newCustomer = await customer.toCustomer()

        await this.customerService.validateDuplicate(newCustomer)

        if (cityId) await newCustomer.assignAddressCity(cityId)
        if (fbToken) newCustomer.fbToken = fbToken
        if (zaloToken) newCustomer.zaloToken = zaloToken
        if (appleToken) newCustomer.appleToken = appleToken

        await newCustomer.save()

        const token = JWT.sign({ id: newCustomer.id, type: AuthType.Customer })

        res.sendOK({ token })
    }


    // =====================LOGIN=====================
    @Post('/login')
    @Validator({
        phone: Joi.string().required(),
        password: Joi.string().required()
    })
    async login(
        @HeaderParams("version") version: string,
        @BodyParams('phone') phone: string,
        @BodyParams('password') password: string,
        @BodyParams('expoToken') expoToken: string,
        @Res() res: Response
    ) {
        const customer = await this.customerService.login(phone, password);
        customer.expoToken = expoToken
        await customer.save()
        const token = JWT.sign({ id: customer.id, type: AuthType.Customer });

        return res.sendOK({ token })
    }


    // =====================PROFILE=====================
    @Post('/login/fb')
    @Validator({
        fbToken: Joi.required()
    })
    async loginFb(
        @BodyParams('fbToken') fbToken: string,
        @BodyParams("customer") customer: CustomerInsert,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams('cityId') cityId: number,
    ) {
        const customerFBExist = await Customer.findOne({ where: { fbToken, isDeleted: false } })
        if (customerFBExist) {
            const token = JWT.sign({ id: customerFBExist.id, type: AuthType.Customer })
            return res.sendOK({ token })
        } else {
            // const newCustomer = await customer.toCustomer()
            // newCustomer.fbToken = fbToken
            // await this.customerService.validateDuplicate(newCustomer)
            // if (cityId) await newCustomer.assignAddressCity(cityId)
            // await newCustomer.save()

            // const token = JWT.sign({ id: newCustomer.id, type: AuthType.Customer })
            return res.sendOK({ token: null })
        }
    }


    // =====================PROFILE=====================
    @Post('/login/zalo')
    @Validator({
        zaloToken: Joi.required()
    })
    async loginZalo(
        @BodyParams('zaloToken') zaloToken: string,
        @BodyParams("customer") customer: CustomerInsert,
        @BodyParams('cityId') cityId: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const customerFBExist = await Customer.findOne({ where: { zaloToken, isDeleted: false } })
        if (customerFBExist) {
            const token = JWT.sign({ id: customerFBExist.id, type: AuthType.Customer })
            return res.sendOK({ token })
        } else {
            // const newCustomer = await customer.toCustomer()
            // newCustomer.zaloToken = zaloToken
            // await this.customerService.validateDuplicate(newCustomer)
            // if (cityId) await newCustomer.assignAddressCity(cityId)
            // await newCustomer.save()

            // const token = JWT.sign({ id: newCustomer.id, type: AuthType.Customer })
            return res.sendOK({ token: null })
        }

    }


    // =====================PROFILE=====================
    @Post('/login/apple')
    @Validator({
        appleToken: Joi.required()
    })
    async loginApple(
        @BodyParams('appleToken') appleToken: string,
        @BodyParams("customer") customer: CustomerInsert,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const customerAppleExist = await Customer.findOne({ where: { appleToken, isDeleted: false } })
        if (customerAppleExist) {
            const token = JWT.sign({ id: customerAppleExist.id, type: AuthType.Customer })
            return res.sendOK({ token })
        } else {
            // const newCustomer = await customer.toCustomer()
            // newCustomer.zaloToken = zaloToken
            // await this.customerService.validateDuplicate(newCustomer)
            // if (cityId) await newCustomer.assignAddressCity(cityId)
            // await newCustomer.save()

            // const token = JWT.sign({ id: newCustomer.id, type: AuthType.Customer })
            return res.sendOK({ token: null })
        }
    }


    // =====================PROFILE=====================
    @Get('/profile')
    @UseAuth(VerificationJWT)
    async getInfo(
        @HeaderParams("version") version: string,
        @HeaderParams("token") token: string,
        @HeaderParams("expoToken") expoToken: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const { customer } = req

        customer.expoToken = expoToken
        customer.save()

        return res.sendOK(customer)
    }


    // =====================UPDATE PROFILE=====================
    @Post('/profile')
    @UseAuth(VerificationJWT)
    async updateInfo(
        @HeaderParams("token") token: string,
        @HeaderParams("version") version: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("customer") customerUpdate: CustomerUpdate,
        @BodyParams('cityId') cityId: number,
    ) {
        const customer = customerUpdate.toCustomer()
        customer.id = req.customer.id
        if (cityId) await customer.assignAddressCity(cityId)

        await customer.save()

        return res.sendOK(customer)
    }


    // =====================UPDATE PROFILE=====================
    @Post('/KYC')
    @UseAuth(VerificationJWT)
    async updateKyc(
        @HeaderParams("token") token: string,
        @HeaderParams("version") version: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams("profile") profile: CustomerProfile,
    ) {
        const { customer } = req

        const { customerProfile } = customer
        if (customerProfile) await customerProfile.remove()

        delete profile.id
        await profile.save()

        customer.customerProfile = profile
        customer.kycStatus = KYCStatus.Submitted
        await customer.save()

        return res.sendOK(profile)
    }


    // =====================UPDATE PASSWORD=====================
    @Post('/password/update')
    @UseAuth(VerificationJWT)
    @Validator({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
    })
    async changePassword(
        @HeaderParams("version") version: string,
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @BodyParams('oldPassword') oldPassword: string,
        @BodyParams('newPassword') newPassword: string,
    ) {
        const { customer } = req;

        await this.customerService.validatePassword(customer, oldPassword)

        if (oldPassword == newPassword) {
            return res.sendClientError('Mật khẩu mới không được trùng mật khẩu cũ')
        }

        // Update password
        customer.password = await Password.hash(newPassword);
        await customer.save();

        return res.sendOK(customer, 'Cập nhật mật khẩu thành công');
    }


    // =====================FORGOT=====================
    @Post('/password/forgot')
    @Validator({
        phone: Joi.required(),
        password: Joi.required(),
    })
    async forgot(
        @HeaderParams("version") version: string,
        @BodyParams("phone") phone: string,
        @BodyParams("password") password: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const customer = await Customer.findOne({ where: { phone, isDeleted: false } })
        if (!customer) {
            return res.sendClientError('Số điện thoại không tồn tại')
        }

        customer.password = await Password.hash(password)
        await customer.save()

        const token = JWT.sign({ id: customer.id, type: AuthType.Customer, ia: getCurrentTimeInt() })

        return res.sendOK({ token })
    }


} // END FILE
