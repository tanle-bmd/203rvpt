// IMPORT LIBRARY
import { Service } from "@tsed/common";

// IMPORT CUSTOM
import { CoreService } from "../core/services/CoreService";
import { BadRequest } from "ts-httpexceptions";
import { Customer } from "../entity/Customer";
import { Password } from "../util/password";

interface GetCustomerParams {
    search: string
    page: number
    limit: number
}

@Service()
export class CustomerService extends CoreService {

    public async findManyAndCount({ search, page, limit }: GetCustomerParams) {
        let where = ` CONCAT(customer.name, ' ', customer.phone) LIKE '%${search}%' 
        AND customer.isDeleted = false`

        const [customers, total] = await Customer.createQueryBuilder('customer')
            .where(where)
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('customer.id', 'DESC')
            .getManyAndCount()

        return [customers, total]
    }


    public async login(phone: string, password: string): Promise<Customer> {
        const customer = await Customer.findOneOrThrowOption({
            where: { phone, isDeleted: false }
        }, 'Tài khoản')

        await this.validatePassword(customer, password)

        if (customer.isBlock) {
            throw new BadRequest('Tài khoản này đã bị khoá!')
        }

        return customer
    }


    async validateDuplicate(customer: Customer, userId: number = null) {
        const { phone, email } = customer

        const oldCustomer = await Customer.findOne({
            where: [{ phone, isDeleted: false }, { email, isDeleted: false }]
        })

        if (oldCustomer && oldCustomer.id != userId) {
            let message = ""

            if (oldCustomer.phone == phone) {
                message = "Số điện thoại"
            } else if (oldCustomer.email == email) {
                message = "Email"
            }

            throw new BadRequest(`${message} đã tồn tại`)
        }
    }


    async validatePassword(customer: Customer, password: string) {
        const customerWithPassword = await Customer.findOneOrThrowOption({
            where: { id: customer.id },
            select: ['id', 'password']
        })

        const validate = await Password.validate(password, customerWithPassword.password)
        if (!validate) {
            throw new BadRequest('Mật khẩu không chính xác.')
        }
    }


    public async validatePhoneDuplicate(phone: string) {
        let oldCustomer = await Customer.findOne({
            where: [{ phone: phone, isDeleted: false }]
        })

        if (oldCustomer) throw new BadRequest("Số điện thoại đã được sử dụng!")
    }

} // END FILE
