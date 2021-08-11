import { Property } from "@tsed/common";

export class PermissionImport {
    // PROPERTIES

    @Property()
    path: string;

    @Property()
    children: PermissionImport[];

}
