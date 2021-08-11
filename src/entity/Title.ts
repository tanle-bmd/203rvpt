import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';

@Entity(addPrefix("title"))
export class Title extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES


    // RELATIONS


    // METHODS
    

} // END FILE
