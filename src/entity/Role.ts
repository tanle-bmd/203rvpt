import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Permission } from "./Permission";
import { Staff } from "./Staff";

@Entity(addPrefix("role"))
export class Role extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column()
    @Property()
    name: string;

    @Column()
    @Property()
    description: string


    // RELATIONS
    
    @OneToMany(() => Staff, admin => admin.role)
    staff: Staff[]

    @ManyToMany(() => Permission, permission => permission.roles)
    permissions: Permission[]

    // METHODS

} // END FILE
