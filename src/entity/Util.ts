import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Post } from "./Post";

@Entity(addPrefix("util"))
export class Util extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column({ default: '' })
    @Property()
    name: string

    @Column('text', { nullable: true })
    @Property()
    image: string;

    @Column('text', { nullable: true })
    @Property()
    imageActive: string;

    @Column({ default: false, select: false })
    @Property()
    isDeleted: boolean


    // RELATIONS

    @ManyToOne(type => Post, post => post.utils)
    post: Post;


    // METHODS


} // END FILE
