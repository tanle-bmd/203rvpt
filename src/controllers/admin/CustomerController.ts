import { Controller, Post, UseAuth, Req, Request, Res, Response, HeaderParams, BodyParams, Get, PathParams, QueryParams } from '@tsed/common';
import { Docs } from '@tsed/swagger';
import Joi from '@hapi/joi';
import { Like, Raw } from 'typeorm';

import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Validator } from '../../middleware/validator/Validator';
import { Customer, KYCStatus } from '../../entity/Customer';
import { Password } from '../../util/password';
import { CustomerProfile, CustomerProfileStatus } from '../../entity/CustomerProfile';
import JWT, { AuthType } from '../../middleware/auth/strategy/JWT';

@Controller("/admin/customer")
@Docs("docs_admin")
export class CustomerController {
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
        @QueryParams("page") page: number,
        @QueryParams("limit") limit: number,
        @QueryParams("search") search: string = "",
        @QueryParams('cityId') cityId: number,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `customer.name LIKE '%${search}%' AND customer.isDeleted = false`

        if (cityId) {
            where += ` AND addressCity.id = ${cityId}`
        }

        const [customer, total] = await Customer.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.addressCity', 'addressCity')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('customer.id', 'DESC')
            .getManyAndCount()

        return res.sendOK({ data: customer, total })
    }


    // =====================GET LIST=====================
    @Get('/kyc/submitted')
    @UseAuth(VerificationJWT)
    @Validator({
        page: Joi.number().min(0),
        limit: Joi.number().min(0)
    })
    async getKYCSubmitted(
        @HeaderParams("token") token: string,
        @QueryParams("page") page: number,
        @QueryParams("limit") limit: number,
        @QueryParams("search") search: string = "",
        @QueryParams('cityId') cityId: number,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let where = `customer.name LIKE '%${search}%' 
        AND customer.isDeleted = false
        AND customer.kycStatus = '${KYCStatus.Submitted}'
        AND customerProfile.id IS NOT NULL
        `

        if (cityId) {
            where += ` AND addressCity.id = ${cityId}`
        }

        const [customer, total] = await Customer.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.addressCity', 'addressCity')
            .leftJoinAndSelect('customer.customerProfile', 'customerProfile')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('customer.updatedAt', 'ASC')
            .getManyAndCount()

        return res.sendOK({ data: customer, total })
    }


    // =====================UPDATE ITEM=====================
    @Post('/:customerId/kyc/accept')
    @UseAuth(VerificationJWT)
    @Validator({
        customerId: Joi.number().required(),
        status: Joi.required(),
    })
    async accept(
        @Req() req: Request,
        @Res() res: Response,
        @HeaderParams("token") token: string,
        @PathParams("customerId") customerId: number,
        @BodyParams('status') status: KYCStatus,
    ) {
        const customer = await Customer.findOneOrThrowId(+customerId, {
            relations: ['customerProfile']
        })

        customer.kycStatus = status
        await customer.save()

        const { customerProfile } = customer
        customerProfile.status = CustomerProfileStatus.Complete
        await customerProfile.save()

        return res.sendOK(customer, 'Cập nhật thành công!')
    }


    // =====================UPDATE ITEM=====================
    @Post('/:customerId/kyc/cancel')
    @UseAuth(VerificationJWT)
    @Validator({
        customerId: Joi.number().required(),
    })
    async cancelKYC(
        @Req() req: Request,
        @Res() res: Response,
        @HeaderParams("token") token: string,
        @PathParams("customerId") customerId: number,
    ) {
        const customer = await Customer.findOneOrThrowId(+customerId, {
            relations: ['customerProfile']
        })

        customer.kycStatus = KYCStatus.Waiting
        await customer.save()

        const { customerProfile } = customer
        if (customerProfile) {
            await customerProfile.save()
        }

        return res.sendOK(customer, 'Cập nhật thành công!')
    }


    // =====================UPDATE ITEM=====================
    @Post('/:customerId/update')
    @UseAuth(VerificationJWT)
    @Validator({
        customer: Joi.required(),
        customerId: Joi.number().required()
    })
    async update(
        @Req() req: Request,
        @Res() res: Response,
        @HeaderParams("token") token: string,
        @BodyParams("customer") customer: Customer,
        @PathParams("customerId") customerId: number,
        @BodyParams('cityId') cityId: number,
    ) {
        await Customer.findOneOrThrowId(+customerId)
        customer.id = customerId

        if (cityId) await customer.assignAddressCity(cityId)

        await customer.save()

        return res.sendOK(customer, 'Cập nhật thành công!')
    }

    // =====================GET ITEM=====================
    @Get('/:customerId')
    @UseAuth(VerificationJWT)
    @Validator({
        customerId: Joi.number().required(),
    })
    async findOne(
        @Req() req: Request,
        @Res() res: Response,
        @HeaderParams("token") token: string,
        @PathParams("customerId") customerId: number,

    ) {
        const customer = await Customer.findOneOrThrowId(+customerId, {
            relations: ['customerProfile', 'addressCity']
        })

        return res.sendOK(customer)
    }


    // =====================RESET PASSWORD=====================
    @Post('/:customerId/update/password')
    @UseAuth(VerificationJWT)
    @Validator({
        customerId: Joi.number().required(),
        password: Joi.string().required()
    })
    async updatePassword(
        @Req() req: Request,
        @Res() res: Response,
        @HeaderParams('token') token: string,
        @PathParams('customerId') customerId: number,
        @BodyParams('password') password: string
    ) {
        const customer = await Customer.findOneOrThrowId(+customerId);
        customer.password = await Password.hash(password)
        await customer.save()

        return res.sendOK(customer, 'Cập nhật thành công.')
    }


    // =====================DELETE=====================
    @Post('/:customerId/delete')
    @UseAuth(VerificationJWT)
    @Validator({
    })
    async delete(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @PathParams("customerId") customerId: number,
    ) {
        let customer = await Customer.findOneOrThrowId(customerId)
        customer.isDeleted = true
        await customer.save()
        return res.sendOK(customer)
    }

} // END FILE
