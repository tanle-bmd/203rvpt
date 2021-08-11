import { Property } from "@tsed/common";

import { Staff } from '../entity/Staff';

export class StaffUpdate {
    toStaff(): Staff {
        const staff = new Staff()
        staff.name = this.name
        staff.avatar = this.avatar
        staff.phone = this.phone
        staff.email = this.email
        staff.isBlock = this.isBlock
        return staff
    }

    // PROPERTIES

    @Property()
    name: string;

    @Property()
    avatar: string;

    @Property()
    phone: string;

    @Property()
    email: string;

    @Property()
    isBlock: boolean;

} // END FILE
