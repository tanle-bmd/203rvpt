import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Customer } from "./Customer";
import { Post } from "./Post";

@Entity(addPrefix("post_favorite"))
export class PostFavorite extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES


    // RELATIONS

    @ManyToOne(type => Post, post => post.postFavorites)
    post: Post;

    @ManyToOne(type => Customer, customer => customer.postFavorites)
    customer: Customer;


    // METHODS


} // END FILE
