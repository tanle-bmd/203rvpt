import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Post } from "./Post";

@Entity(addPrefix("address_district"))
export class AddressDistrict extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column({ default: false })
    @Property()
    isBlock: boolean

    @Column({ default: 0 })
    @Property()
    priority: number

    @Column({ default: '' })
    @Property()
    parentCode: string

    @Column({ default: '' })
    @Property()
    code: string

    @Column({ default: '' })
    @Property()
    pathWithType: string

    @Column({ default: '' })
    @Property()
    path: string

    @Column({ default: '' })
    @Property()
    nameWithType: string

    @Column({ default: '' })
    @Property()
    type: string

    @Column({ default: '' })
    @Property()
    slug: string

    @Column({ default: '' })
    @Property()
    name: string

    @Column({ default: 0 })
    @Property()
    feeDelivery: number


    // RELATIONS

    @OneToMany(type => Post, posts => posts.addressDistrict)
    posts: Post[];


    // METHODS


} // END FILE
