// IMPORT LIBRARY
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

// IMPORT CUSTOM
import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Role } from "./Role";

@Entity(addPrefix("staff"))
export class Staff extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column()
    @Property()
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ default: "" })
    @Property()
    name: string;

    @Column({ default: "" })
    @Property()
    avatar: string;

    @Column({ default: "" })
    @Property()
    phone: string

    @Column({ default: "" })
    @Property()
    email: string

    @Column({ default: false })
    @Property()
    isBlock: boolean

    // RELATIONS

    @ManyToOne(type => Role, role => role.staff)
    role: Role;


    // METHODS


} // END FILE
