import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Role } from "./Role";

@Entity(addPrefix("permission"))
export class Permission extends CoreEntity {
    constructor() {
        super()
    }
    
    // PROPERTIES

    @Column()
    @Property()
    path: string;


    // RELATIONS

    @ManyToMany(type => Role, role => role.permissions)
    @JoinTable()
    roles: Role[]

    // METHODS

} // END FILE
