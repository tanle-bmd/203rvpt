// IMPORT LIBRARY
import { Controller, UseAuth, Req, Get, Res, Response, HeaderParams, PathParams, QueryParams } from '@tsed/common';
import Joi from '@hapi/joi';
import { Docs } from '@tsed/swagger';
import { Request } from 'express';


// IMPORT CUSTOM
import { Validator } from '../../middleware/validator/Validator';
import { VerificationJWT } from '../../middleware/auth/VerificationJWT';
import { Customer } from '../../entity/Customer';
import { Post } from '../../entity/Post';
import { Util } from '../../entity/Util';
import { convertIntToDDMMYY, getDateInterval, getFromToDate } from '../../util/helper';


@Controller("/admin/dashboard")
@Docs("docs_admin")
export class DashboardController {
    constructor() { }


    // =====================INDEX=====================
    @Get('')
    @UseAuth(VerificationJWT)
    @Validator({})
    async index(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const totalCustomer = await Customer.count({ where: { isDeleted: false } })
        const totalPost = await Post.count({ where: { isDeleted: false } })
        const totalBlockedPost = await Post.count({ where: { isDeleted: false, isBlock: true } })
        const totalUtil = await Util.count({ where: { isDeleted: false } })

        return {
            totalCustomer,
            totalPost,
            totalBlockedPost,
            totalUtil
        }
    }


    // =====================INDEX=====================
    @Get('/postGroupByDay')
    @UseAuth(VerificationJWT)
    @Validator({})
    async groupPost(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @QueryParams("from") from: Date,
        @QueryParams("to") to: Date,
        @QueryParams('cityId') cityId: number,
    ) {
        let where = `post.isDeleted = false`

        if (from && to) {
            const { start, end } = getFromToDate(from, to)
            where += ` AND post.createdAt BETWEEN ${start} AND ${end} `
        }

        if (cityId) {
            where += ` AND addressCity.id = ${cityId}`
        }

        const posts = await Post.createQueryBuilder('post')
            .leftJoinAndSelect('post.addressCity', 'addressCity')
            .where(where)
            .orderBy('post.id', 'DESC')
            .getMany()

        const dic = {}

        posts.map(p => {
            const date = convertIntToDDMMYY(p.createdAt)
            if (!dic[date]) {
                dic[date] = 1
            } else {
                dic[date] += 1
            }
        })

        const result = []
        for (const date in dic) {
            if (Object.prototype.hasOwnProperty.call(dic, date)) {
                const count = dic[date];
                result.push({ date, count })
            }
        }

        return result
    }


    // =====================INDEX=====================
    @Get('/customerGroupByDay')
    @UseAuth(VerificationJWT)
    @Validator({})
    async groupCustomer(
        @HeaderParams("token") token: string,
        @Req() req: Request,
        @Res() res: Response,
        @QueryParams("from") from: Date,
        @QueryParams("to") to: Date,
        @QueryParams('cityId') cityId: number,
    ) {
        let where = `customer.isDeleted = false`

        if (from && to) {
            const { start, end } = getFromToDate(from, to)
            where += ` AND customer.createdAt BETWEEN ${start} AND ${end} `
        }

        if (cityId) {
            where += ` AND addressCity.id = ${cityId}`
        }

        const customers = await Customer.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.addressCity', 'addressCity')
            .where(where)
            .orderBy('customer.id', 'DESC')
            .getMany()

        const dic = {}

        customers.map(c => {
            const date = convertIntToDDMMYY(c.createdAt)
            if (!dic[date]) {
                dic[date] = 1
            } else {
                dic[date] += 1
            }
        })

        const result = []
        for (const date in dic) {
            if (Object.prototype.hasOwnProperty.call(dic, date)) {
                const count = dic[date];
                result.push({ date, count })
            }
        }

        return result
    }

} // END FILE


