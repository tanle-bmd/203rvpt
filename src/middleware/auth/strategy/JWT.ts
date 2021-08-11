import { InternalServerError } from 'ts-httpexceptions';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { Unauthorized } from 'ts-httpexceptions';

import AuthStrategy from './AuthStrategy';
import { Staff } from '../../../entity/Staff';
import { Customer } from '../../../entity/Customer';
import logger from '../../../util/logger';
import CONFIG from '../../../../config';
// import { Driver } from '../../../entity/Driver';
import { getCurrentTimeInt } from '../../../util/helper';

export enum AuthType {
    Staff = "ADMIN",
    Customer = "CUSTOMER",
    // Driver = 'DRIVER'
}

interface JWTSignedData {
    id: number,
    type: AuthType,
    ia?: number
}

interface RequestHeaders {
    token?: string,
    version?: string
}

const VERSION = '1.0.0'

export default class JWT implements AuthStrategy {

    public async auth(req: Request): Promise<any> {
        const { baseUrl } = req

        if (this.checkRouter(baseUrl, AuthType.Staff)) {
            return await this.authenticateStaff(req)
        }

        // if (this.checkRouter(baseUrl, AuthType.Driver)) {
        //     return await this.authenticateDriver(req)
        // }

        return await this.authenticateCustomer(req)
    }


    private checkRouter(baseUrl: string, type: AuthType) {
        return baseUrl.includes(`${CONFIG.PREFIX_URL}/${type.toLowerCase()}`);
    }


    // private async authenticateDriver(req: Request) {
    //     const { token, version } = <RequestHeaders>req.headers

    //     if (version != VERSION) {
    //         throw new InternalServerError(`Phiên bản hiện tại chưa được cập nhật. 
    //         Vui lòng thoát hoàn toàn ứng dụng (bao gồm chạy ngầm) rồi mở lại. 
    //         Nếu vẫn chưa được hãy lên cửa hàng ứng dụng cập nhật lại phiên bản mới nhất.`)
    //     }

    //     const driverId = this.getAuthId(token, AuthType.Driver);
    //     const driver = await Driver.findOneOrThrowId(driverId, null, 'Tài xế');
    //     if (driver.isBlock) {
    //         throw new Unauthorized("Tài khoản đã bị khoá!")
    //     }

    //     req.driver = driver;
    //     req.authType = AuthType.Driver
    // }


    public async authenticateCustomer(req: Request) {
        const { token, version } = <RequestHeaders>req.headers

        // if (version != VERSION) {
        //     throw new InternalServerError(`Phiên bản hiện tại chưa được cập nhật. 
        //     Vui lòng thoát hoàn toàn ứng dụng (bao gồm chạy ngầm) rồi mở lại. 
        //     Nếu vẫn chưa được hãy lên cửa hàng ứng dụng cập nhật lại phiên bản mới nhất.`)
        // }

        const customerId = this.getAuthId(token, AuthType.Customer);
        const customer = await Customer.findOneOrThrowId(customerId, {
            relations: ['customerProfile', 'addressCity'],
            where: { isDeleted: false }
        }, 'Tài khoản');

        if (customer.isBlock) {
            throw new Unauthorized("Tài khoản đã bị khoá!")
        }

        req.customer = customer;
        req.authType = AuthType.Customer
    }


    private async authenticateStaff(req: Request) {
        const { token } = req.headers

        const staffId = this.getAuthId(token, AuthType.Staff);
        const staff = await Staff.findOneOrThrowId(staffId, null, 'Tài khoản');
        if (staff.isBlock) {
            throw new Unauthorized("Tài khoản đã bị khoá!")
        }

        req.staff = staff;
        req.authType = AuthType.Staff
    }


    public getAuthId(token: any, type: AuthType): number {
        if (!token) {
            throw new Unauthorized("Xác thực không hợp lệ!")
        }

        try {
            const decoded = <JWTSignedData>jwt.verify(token, CONFIG.JWT_SECRET)
            if (decoded.id && decoded.type == type) {
                return decoded.id
            } else {
                throw new Unauthorized("Xác thực không hợp lệ!")
            }
        } catch (error) {
            logger('error').error('Error Get Authenticate ID: ', JSON.stringify(error))
            throw new Unauthorized("Xác thực không hợp lệ!")
        }
    }


    static getIa(token: string): number {
        if (!token) {
            return 0
        }

        try {
            const decoded = <JWTSignedData>jwt.verify(token, CONFIG.JWT_SECRET)
            return decoded.ia
        } catch (error) {
            return 0
        }
    }


    static sign(data: JWTSignedData): string {
        data = { ...data, ia: getCurrentTimeInt() }
        return jwt.sign(data, CONFIG.JWT_SECRET, { expiresIn: CONFIG.JWT_EXPIRE })
    }

}
