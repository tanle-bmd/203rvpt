import { Service } from "@tsed/common";

import { CoreService } from "../core/services/CoreService";
import { Role } from "../entity/Role";
import { Permission } from "../entity/Permission";
import { PermissionImport } from "../entity-request/PermissionImport";

const ROLE_ADMIN = 1

@Service()
export class RoleService extends CoreService {

    async resetRoleForAdmin(permissions: Permission[]) {
        const adminRole = await Role.findOne(ROLE_ADMIN)
        adminRole.permissions = permissions
        adminRole.save()
    }


    private convertPermissionImport(permissionImports: PermissionImport[], path: string = ""): Permission[] {
        let permissions: Permission[] = []

        for (let i = 0; i < permissionImports.length; i++) {
            const permissionImport = permissionImports[i];

            if (!permissionImport.path.includes("/")) {
                permissionImport.path = "/" + permissionImport.path
            }

            if (!permissionImport.children || permissionImport.children.length <= 0) {
                const permission = new Permission()
                permission.path = path + permissionImport.path
                permissions.push(permission)
            } else {
                permissions = permissions.concat(
                    this.convertPermissionImport(permissionImport.children, permissionImport.path)
                )
            }
        }

        return permissions
    }

    async import(permissionImports: PermissionImport[]): Promise<Permission[]> {
        const permissions = this.convertPermissionImport(permissionImports)

        await Permission.delete({})
        await Permission.save(permissions)

        return permissions
    }




    // =====================INIT=====================
    async initRole(name: string, description: string) {
        const role = new Role()
        role.name = name
        role.description = description
        await role.save()
        
        return role
    }

} // END FILE
