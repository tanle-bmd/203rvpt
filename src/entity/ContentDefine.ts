import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Property } from "@tsed/common";

export enum ContentDefineType {
    About = "ABOUT",
    Faq = "FAQ",
    HowToUse = "HOW_TO_USE",
    Security = "SECURITY",
    TermCondition = "TERM_CONDITION"
}

@Entity(addPrefix("content_define"))
export class ContentDefine extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column()
    @Property()
    title: string;

    @Column()
    @Property()
    image: string

    @Column({ type: "text" })
    @Property()
    body: string

    @Column()
    @Property()
    type: string;


    // RELATIONS


    // METHODS

    
} // END FILE
