import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, OneToOne, JoinColumn } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Customer } from "./Customer";

export enum CustomerProfileStatus {
    Pending = 'PENDING',
    Complete = 'COMPLETE'
}

@Entity(addPrefix("customer_profile"))
export class CustomerProfile extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column({ default: '' })
    @Property()
    imageIdCardBefore: string

    @Column({ default: '' })
    @Property()
    imageIdCardAfter: string

    @Column({ default: '' })
    @Property()
    companyName: string

    @Column({ default: '' })
    @Property()
    taxCode: string

    @Column({ default: '' })
    @Property()
    representationName: string

    @Column('text', { nullable: true })
    @Property()
    companyAddress: string;

    @Column({ default: '' })
    @Property()
    imageBusinessLicense: string

    @Column({ default: CustomerProfileStatus.Pending })
    @Property()
    status: CustomerProfileStatus

    @Column('text', { nullable: true })
    @Property()
    reasonCancel: string;


    // RELATIONS

    @OneToOne(type => Customer, customer => customer.customerProfile)
    @JoinColumn()
    customer: Customer;


    // METHODS


} // END FILE
