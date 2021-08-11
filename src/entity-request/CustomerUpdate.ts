// IMPORT LIBRARY
import { Property } from "@tsed/common";

// IMPORT CUSTOM
import { Customer } from "../entity/Customer";

export class CustomerUpdate {
    // Transform to draw entity
    toCustomer(): Customer {
        const customer = new Customer()
        customer.name = this.name
        customer.email = this.email
        customer.address = this.address
        customer.avatar = this.avatar
        customer.postType = this.postType
        customer.gender = this.gender
        customer.phone = this.phone

        return customer
    }

    // PROPERTIES

    @Property()
    phone: string

    @Property()
    gender: string

    @Property()
    postType: string

    @Property()
    name: string;

    @Property()
    avatar: string;

    @Property()
    address: string

    @Property()
    email: string

} // END FILE
