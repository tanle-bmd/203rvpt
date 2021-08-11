import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm";
import { Property } from "@tsed/common";

import { addPrefix } from "../util/helper"
import CoreEntity from '../core/entity/CoreEntity';
import { CustomerNotification } from "./CustomerNotification";
import { News } from "./News";
import { Post } from "./Post";

export enum NotificationType {
    Post = 'POST',
    News = 'NEWS'
}

@Entity(addPrefix("notification"))
export class Notification extends CoreEntity {
    constructor() {
        super()
    }

    // PROPERTIES

    @Column('text', { nullable: true })
    @Property()
    title: string;

    @Column('text', { nullable: true })
    @Property()
    body: string;

    @Column({ default: false, select: false })
    @Property()
    isDeleted: boolean

    @Column({ default: '' })
    @Property()
    type: string

    @Column({ default: 0 })
    @Property()
    publishAt: number


    // RELATIONS

    @OneToMany(type => CustomerNotification, customerNotifications => customerNotifications.notification)
    customerNotifications: CustomerNotification[];

    @ManyToOne(type => News, news => news.notifications)
    news: News;

    @ManyToOne(type => Post, post => post.notifications)
    post: Post;


    // METHODS

    public async assignPost(postId: number) {
        const post = await Post.findOneOrThrowId(postId, null, '')
        this.post = post
    }

    public async assignNews(newsId: number) {
        const news = await News.findOneOrThrowId(newsId, null, '')
        this.news = news
    }


} // END FILE
