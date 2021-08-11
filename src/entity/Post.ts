import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix, getCurrentTimeInt } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { Util } from "./Util";
import { PostGallery } from "./PostGallery";
import { Notification } from "./Notification";
import { PostFavorite } from "./PostFavorite";
import { AddressCity } from "./AddressCity";
import { AddressDistrict } from "./AddressDistrict";
import { AddressWard } from "./AddressWard";
import { Customer } from "./Customer";
import { PostStorage } from "./PostStorage";

export enum PostType {
    Lease = 'LEASE', // Cho thue
    Rent = 'RENT', // Di thue, tim phong
    Buy = 'BUY', // Mua
    Sell = 'SELL' // Ban
}

export enum RoomType {
    Room = 'ROOM', // Phong
    Apartment = 'APARTMENT', // Can ho
    MiniApartment = 'MINI_APARTMENT',
    House = 'HOUSE'
}

export enum Legal {
    Red = 'RED',
    Pink = 'PINK',
    Other = 'OTHER'
}

@Entity(addPrefix("post"))
export class Post extends CoreEntity {
    isFavorite: boolean;

    constructor() {
        super()
    }

    // PROPERTIES

    @Column('text', { nullable: true })
    @Property()
    title: string;

    @Column('longtext', { nullable: true })
    @Property()
    description: string;

    @Column('text', { nullable: true })
    @Property()
    address: string;

    @Column({ default: PostType.Rent })
    @Property()
    postType: PostType

    @Column({ default: RoomType.Room })
    @Property()
    roomType: RoomType

    @Column("double", { default: 0 })
    @Property()
    price: number // Gia

    @Column("double", { default: 0 })
    @Property()
    area: number // Dien tich, dien tich dat

    @Column({ default: '' })
    @Property()
    image: string // Hinh chinh

    @Column({ default: '' })
    @Property()
    thumbnail: string // Thumbnail neu can

    @Column({ default: '' })
    @Property()
    contactName: string

    @Column({ default: '' })
    @Property()
    contactPhone: string

    @Column({ default: true })
    @Property()
    isShow: boolean

    @Column({ default: false })
    @Property()
    isBlock: boolean

    @Column({ default: false, select: false })
    @Property()
    isDeleted: boolean

    @Column({ default: 0 })
    @Property()
    view: number

    @Column("double", { default: 0 })
    @Property()
    lat: number

    @Column("double", { default: 0 })
    @Property()
    long: number

    @Column({ default: 0 })
    @Property()
    floor: number // So lau

    @Column("double", { default: 0 })
    @Property()
    areaUse: number // Dien tich su dung

    @Column({ default: 0 })
    @Property()
    bedRoom: number // Phong ngu

    @Column({ default: 0 })
    @Property()
    toilet: number // Phong tam

    @Column({ default: Legal.Other })
    @Property()
    legal: Legal // Phap ly

    @Column({ default: '' })
    @Property()
    projectName: string // Ten du an


    // RELATIONS

    @OneToMany(type => Util, utils => utils.post)
    utils: Util[];

    @OneToMany(type => PostGallery, postGalleries => postGalleries.post)
    postGalleries: PostGallery[];

    @OneToMany(type => Notification, notifications => notifications.post)
    notifications: Notification[];

    @OneToMany(type => PostFavorite, postFavorites => postFavorites.post)
    postFavorites: PostFavorite[];

    @ManyToOne(type => AddressCity, addressCity => addressCity.posts)
    addressCity: AddressCity;

    @ManyToOne(type => AddressDistrict, addressDistrict => addressDistrict.posts)
    addressDistrict: AddressDistrict;

    @ManyToOne(type => AddressWard, addressWard => addressWard.posts)
    addressWard: AddressWard;

    @ManyToOne(type => Customer, customer => customer.posts)
    customer: Customer;


    @OneToMany(type => PostStorage, postStorages => postStorages.post)
    postStorages: PostStorage[];


    // METHODS

    public async assignAddressCity(addressCityId: number) {
        const addressCity = await AddressCity.findOneOrThrowId(addressCityId, null, '')
        this.addressCity = addressCity
    }

    public async assignAddressDistrict(addressDistrictId: number) {
        const addressDistrict = await AddressDistrict.findOneOrThrowId(addressDistrictId, null, '')
        this.addressDistrict = addressDistrict
    }

    public async assignAddressWard(addressWardId: number) {
        const addressWard = await AddressWard.findOneOrThrowId(addressWardId, null, '')
        this.addressWard = addressWard
    }

    public async assignUtils(utilIds: number[]) {
        let where = `util.id  IN (:...utilIds) `
        const utils = await Util.createQueryBuilder('util')
            .where(where, { utilIds })
            .orderBy('util.id', 'DESC')
            .getMany()

        this.utils = utils
    }

    public async assignGalleries(urls: string[]) {
        const now = getCurrentTimeInt()
        const list = urls.map(url => {
            if (url) {
                const item = new PostGallery()
                item.image = url
                item.createdAt = item.updatedAt = now
                return item
            }
        })
        await PostGallery.save(list)
        this.postGalleries = list
    }


} // END FILE
