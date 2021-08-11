import { Column, BaseEntity, ObjectType, ObjectID, FindOneOptions, FindConditions, Repository, Connection, PrimaryGeneratedColumn } from "typeorm";
import { BadRequest } from "ts-httpexceptions";

import { getCurrentTimeInt } from "../../util/helper"

export default class CoreEntity extends BaseEntity {
    public static connection: Connection;

    constructor() {
        super()
    }


    // PROPERTIES

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdAt: number;

    @Column()
    updatedAt: number;


    // METHODS

    static getRepository<T extends BaseEntity>(this: ObjectType<T>): Repository<T> {
        const connection: Connection = (this as any).usedConnection || (this as any).connection;
        return connection.getRepository<T>(this);
    }


    save(): Promise<this> {
        if (!this.hasId()) {
            this.createdAt = getCurrentTimeInt()
        }
        this.updatedAt = getCurrentTimeInt()
        return super.save()
    }


    static async findOneOrThrowId<T extends BaseEntity>(
        this: ObjectType<T>, id?: string | number | Date | ObjectID,
        options?: FindOneOptions<T>,
        replaceName?: string
    ): Promise<T> {
        try {
            return await super.findOneOrFail<T>(id, options)
        } catch (error) {
            console.log(error);
            throw new BadRequest(`${replaceName ? replaceName : this.name} không tồn tại.`)
        }
    }


    static async findOneOrThrowOption<T extends BaseEntity>(
        this: ObjectType<T>,
        options?: FindOneOptions<T>,
        replaceName?: string
    ): Promise<T> {
        try {
            return await super.findOneOrFail<T>(options)
        } catch (error) {
            console.log(error);
            throw new BadRequest(`${replaceName ? replaceName : this.name} không tồn tại.`)
        }
    }

} // END FILE
