import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Customer } from "./Customer";
import { Notification } from "./Notification";

export enum CustomerNotificationType {
    Post = 'POST'
}

@Entity(addPrefix("customer_notification"))
export class CustomerNotification extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column('text', { nullable: true })
    @Property()
    title: string;

    @Column('text', { nullable: true })
    @Property()
    body: string;

    @Column({ default: false })
    @Property()
    isSeen: boolean

    @Column({ default: '' })
    @Property()
    type: string


    // RELATIONS

    @ManyToOne(type => Customer, customer => customer.customerNotifications)
    customer: Customer;

    @ManyToOne(type => Notification, notification => notification.customerNotifications)
    notification: Notification;


    // METHODS


} // END FILE
