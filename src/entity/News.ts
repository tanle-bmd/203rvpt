import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Notification } from "./Notification";


@Entity(addPrefix("news"))
export class News extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column({ default: '' })
    @Property()
    title: string

    @Column({ default: '' })
    @Property()
    thumbnail: string

    @Column('longtext', { nullable: true })
    @Property()
    body: string;

    @Column({ default: '' })
    @Property()
    image: string

    @Column({ default: false })
    @Property()
    isDeleted: boolean

    @Column({ default: false })
    @Property()
    isHighlight: boolean


    // RELATIONS

    @OneToMany(type => Notification, notifications => notifications.news)
    notifications: Notification[];


    // METHODS


} // END FILE
