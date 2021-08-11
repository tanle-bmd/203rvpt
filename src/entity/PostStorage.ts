import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Post } from "./Post";
import { Customer } from "./Customer";

@Entity(addPrefix("post_storage"))
export class PostStorage extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES


    // RELATIONS

    @ManyToOne(type => Post, post => post.postStorages)
    post: Post;

    @ManyToOne(type => Customer, customer => customer.postStorages)
    customer: Customer;


    // METHODS


} // END FILE
