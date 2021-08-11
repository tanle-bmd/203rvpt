// IMPORT LIBRARY
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { Property } from "@tsed/common";

// IMPORT CUSTOM
import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { CustomerNotification } from "./CustomerNotification";
import { PostFavorite } from "./PostFavorite";
import { AddressCity } from "./AddressCity";
import { Post } from "./Post";
import { PostStorage } from "./PostStorage";
import { CustomerProfile } from "./CustomerProfile";

export enum GenderType {
    Male = 'MALE',
    Female = 'FEMALE'
}

export enum KYCStatus {
    Waiting = 'WAITING',
    Submitted = 'SUBMITTED',
    Personal = 'PERSONAL',
    Company = 'COMPANY'
}

@Entity(addPrefix("customer"))
export class Customer extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column()
    @Property()
    phone: string

    @Column()
    @Property()
    name: string;

    @Column({ default: '' })
    @Property()
    address: string

    @Column({ default: false })
    @Property()
    password: string

    @Column()
    @Property()
    email: string

    @Column({ default: GenderType.Male })
    @Property()
    gender: string

    @Column({ nullable: true })
    @Property()
    avatar: string;

    @Column({ nullable: true })
    @Property()
    expoToken: string;

    @Column({ default: false })
    @Property()
    isBlock: boolean

    @Column({ default: false, select: false })
    @Property()
    isDeleted: boolean

    @Column({ default: '' })
    @Property()
    postType: string

    @Column({ default: KYCStatus.Waiting })
    @Property()
    kycStatus: KYCStatus

    @Column('text', { nullable: true })
    @Property()
    fbToken: string;

    @Column('text', { nullable: true })
    @Property()
    zaloToken: string;

    @Column('text', { nullable: true })
    @Property()
    appleToken: string;


    // RELATIONS

    @OneToMany(type => CustomerNotification, customerNotifications => customerNotifications.customer)
    customerNotifications: CustomerNotification[];

    @OneToMany(type => PostFavorite, postFavorites => postFavorites.customer)
    postFavorites: PostFavorite[];

    @ManyToOne(type => AddressCity, addressCity => addressCity.customers)
    addressCity: AddressCity;

    @OneToMany(type => Post, posts => posts.customer)
    posts: Post[];

    @OneToMany(type => PostStorage, postStorages => postStorages.customer)
    postStorages: PostStorage[];

    @OneToOne(type => CustomerProfile, customerProfile => customerProfile.customer)
    customerProfile: CustomerProfile;


    // METHODS

    public async assignAddressCity(addressCityId: number) {
        const addressCity = await AddressCity.findOneOrThrowId(addressCityId, null, '')
        this.addressCity = addressCity
    }


} // END FILE
