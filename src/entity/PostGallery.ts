import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Post } from "./Post";

@Entity(addPrefix("post_gallery"))
export class PostGallery extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column({ default: '' })
    @Property()
    image: string


    // RELATIONS

    @ManyToOne(type => Post, post => post.postGalleries)
    post: Post;


    // METHODS


} // END FILE
