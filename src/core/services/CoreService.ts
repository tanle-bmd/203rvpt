import { Service, AfterRoutesInit } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Connection, EntityManager } from "typeorm";
import CoreEntity from "../entity/CoreEntity";

@Service()
export class CoreService implements AfterRoutesInit {
    public connection: Connection;
    public manager: EntityManager

    constructor(
        public typeORMService: TypeORMService,
    ) { }

    $afterRoutesInit() {
        this.connection = <any>this.typeORMService.get()
        this.manager = this.connection.manager
        CoreEntity.connection = this.connection
    }

} // END FILE
