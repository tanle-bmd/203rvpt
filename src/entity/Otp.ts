import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";
import otpGenerator from 'otp-generator';

import { addPrefix, getCurrentTimeInt } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';

@Entity(addPrefix("otp"))
export class Otp extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column()
    @Property()
    code: string

    @Column()
    @Property()
    phone: string

    @Column()
    @Property()
    expire: number

    @Column({ default: false })
    @Property()
    isUsed: boolean


    // RELATIONS


    // METHODS

    toOtp(): Otp {
        const otp = new Otp()
        this.code = this.generateCode()
        this.expire = getCurrentTimeInt() + 3 * 60
        this.isUsed = false
        return otp
    }

    generateCode() {
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
        return otp
    }


} // END FILE
